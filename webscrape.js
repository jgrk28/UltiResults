const axios = require('axios')
const cheerio = require('cheerio');
const { Client } = require('pg');
const { DateTime } = require('luxon');

// Division enum maps each division to its integer id
class Division {
	// Create new instances of division as static attributes to act as enum
	static D1_women = new Division(1);
	static D3_women = new Division(2);
	static D1_men = new Division(3);
	static D3_men = new Division(4);
  
	constructor(id) {
	  this.id = id;
	}

	getId() {
		return this.id;
	}

	//Return appropriate division object (with id) for given string
	static createFromString(division) {
		switch (division) {
			case 'D-I Women':
			case 'College DI Women':
				return this.D1_women;
			case 'D-III Women':
			case 'College DIII Women':
				return this.D3_women;
			case 'D-I Men':
			case 'College DI Men':
				return this.D1_men;
			case 'D-III Men':
			case 'College DIII Men':
				return this.D3_men;
			default:
				throw `${division} is not a division`;
		}
	}

	//Return appropriate division object for given ID
	static createFromId(divId) {
		switch (divId) {
			case 1:
				return this.D1_women;
			case 2:
				return this.D3_women;
			case 3:
				return this.D1_men;
			case 4:
				return this.D3_men;
			default:
				throw `${divId} is not a division ID`;
		}
	}
}

// Team class provides functionality related to the teams database table
class Team {
	//Gets the ID of given team if not in table adds to table
	static async getId(teamName, division, database) {
		const selectQuery = `SELECT id FROM teams WHERE usau_name = 
'${teamName}' AND division_id = ${division.id}`;
		var data = await database.query(selectQuery);
		if (data.rowCount == 0) {
			//TODO try to fetch twitter handle from twitter API
			const insertQuery = `INSERT INTO teams(division_id, usau_name) 
VALUES(${division.id}, '${teamName}') RETURNING id`;
			//Returns new id as if we selected it
			data = await database.query(insertQuery);
		}
		return data.rows[0].id;
	}
}

//Turns dates of the form m(m)/dd into yyyy-mm-dd
const sqlDateFromString = (stringDate) => {
	const curr_year = new Date().getFullYear();
	return new Date(stringDate + `/${curr_year}`).toISOString().slice(0, 10);
}

//Turn scraped strings into appropriate format for INSERT into database tournament table
const formatTournamentInsert = (date, division, event_name, location, event_url) => {
	const start_date = sqlDateFromString(date.split(" ")[0]);
	const end_date = sqlDateFromString(date.split(" ")[2]);
	const division_id = Division.createFromString(division).getId();
	
	return `INSERT INTO tournaments (division_id, start_date, end_date, name, location, url) 
VALUES (${division_id}, '${start_date}', '${end_date}', '${event_name}', '${location}', '${event_url}')`;
}

const convertTime12to24 = (time12h) => {
	const [time, amPm] = time12h.split(' ');
	let [hours, minutes] = time.split(':');
	if (hours === '12') {
	  hours = '00';
	}
	if (amPm === 'PM') {
	  hours = parseInt(hours, 10) + 12;
	}
  
	return `${hours}:${minutes}`;
}

const formatGameInsert = async (tournamentId, date, time, team1, team2, division, database) => {
	//Cut off final word which is always the seed to leave just the team name
	const team1NoSeed = team1.substring(0, team1.lastIndexOf(" "));
	const team2NoSeed = team2.substring(0, team2.lastIndexOf(" "));

	const team1Id = await Team.getId(team1NoSeed, division, database);
	const team2Id = await Team.getId(team2NoSeed, division, database);
	//TODO make sure this doesnt break near new year
	const currYear = new Date().getFullYear();

	//date is in the form 'DOW M(M)/D(D)' e.g. 'Sat 4/30'
	const monthDay = date.split(" ")[1];
	const [month, day] = monthDay.split("/").map(element => parseInt(element, 10));

	//TODO adjust to timezone of tournament
	//time is in the form 'H(H):MM AM/PM' e.g. '9:00 AM'
	const time24h = convertTime12to24(time);
	const [hours, minutes] = time24h.split(":").map(element => parseInt(element, 10));

	const databaseDate = DateTime.local(currYear, month, day, hours, minutes, { zone: 'America/New_York' });
	const databaseTime = databaseDate.toSQL();
	return `INSERT INTO games (tournament_id, team1_id, team2_id, start_time) 
	VALUES (${tournamentId}, ${team1Id}, ${team2Id}, '${databaseTime}')`;;
}

//Scrape tournaments from USA ultimate website and insert into tournament table
//TODO safer db connect/unconnect and better error handling
const getTournaments = async () => {
	try {
		//TODO move connection outside and pass in when needed
		//connect to database
		const { Client } = require('pg');
		const client = new Client();
		await client.connect();

		//get html for USA Ultimate with
		const { data } = await axios.get(
			'https://usaultimate.org/college/schedule/'
		);

		const $ = cheerio.load(data);
		//helper to remove the given selector for an arbitrary cheerio node 
        $.fn.ignore = function(sel) {
            return this.clone().find(sel || ">*").remove().end();
        };
		//each table row represents one tournament (both past and future)
        const test = $('.schedule-table > tbody > tr')
		    .each(async (i, element) => {
				const date = $(element).find('td.date').ignore("span").text().trim();
				const division = $(element).find('td.division').ignore("span").text().trim();
				const event_name = $(element).find('td.event').ignore("span").text().trim();
				const location = $(element).find('td.location').ignore("span").text().trim();
				//link to detailed schedule page
				const event_url = $(element).find('td.results > a').attr('href');
				try {
					const insert_query = 
						formatTournamentInsert(date, division, event_name, location, event_url);
					//await client.query(insert_query);
				} catch(error) {
					console.log(error);
				}
				await client.end()
		    });
	} catch (error) {
		throw error;
	}
};

//Scrape tournament schedule from given USA ultimate url
//url - string representing the base url for the tournament info page
//division - Division object determining which division to get the schedule for
const getSchedule = async (tournamentId, database) => {
	const selectString = `SELECT * FROM tournaments WHERE id = ${tournamentId}`
	const tournamentQuery = await database.query(selectString);
	const tournament = tournamentQuery.rows[0];

	const division = Division.createFromId(tournament.division_id);
	const url = tournament.url;

	try {
		var fullUrl = url + "/schedule";
		switch (division) {
			case Division.D1_women:
			case Division.D3_women:
				fullUrl = fullUrl + "/Women/CollegeWomen/";
				break;
			case Division.D1_men:
			case Division.D3_men:
				fullUrl = fullUrl + "/Men/CollegeMen/";
				break;
			default:
				`division ${division.id} is unknown`
		}

		//get html for USA Ultimate schedule site
		const { data } = await axios.get(fullUrl);

		const $ = cheerio.load(data);
		//each table row represents one tournament (both past and future)
        const games = $('.scores_table > tbody > tr:not(:first-child)').toArray();
		for (const game of games) {
			const day = $(game).find("td:eq(0)").text().trim();
			const time = $(game).find("td:eq(1)").text().trim();
			const team1 = $(game).find("td:eq(3)").text().trim();
			const team2 = $(game).find("td:eq(4)").text().trim();
			try {
				const insert_query = 
					await formatGameInsert(tournamentId, day, time, team1, team2, division, database);
				await database.query(insert_query);
			} catch(error) {
				console.log(error);
			}
		}
	} catch (error) {
		throw error;
	}
};

//For testing only needed to run async top level
const runTest = async() => {
	const database = new Client();
	await database.connect();
	//getTournaments()
	await getSchedule(5, database);
	await database.end();
}

runTest();
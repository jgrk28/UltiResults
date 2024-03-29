const axios = require('axios')
const cheerio = require('cheerio');
const { DateTime } = require('luxon');

// Class to scrape all data needed (mostly tournament schedules)
class WebScraper {
	constructor(pool) {
		this.pool = pool;
	}

	//Turns dates of the form m(m)/dd into yyyy-mm-dd
	sqlDateFromString = (stringDate) => {
		const curr_year = new Date().getFullYear(); 
		return DateTime.fromFormat(stringDate + `/${curr_year}`, 'D').toSQLDate();
	}

	//Convert from the form 'H(H):MM AM/PM' e.g. '9:00 AM' to 24 hour 'H(H):MM'
	convertTime12to24 = (time12h) => {
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

	//Gives the timezone based on a location in the US in the formate City, ST where ST is the 2 letter state abr.
	//Simple method just looks at the state
	getTimeZone = (location) => {
		const timezones = {
			WA: 'America/Los_Angeles',
			OR: 'America/Los_Angeles',
			CA: 'America/Los_Angeles',
			NV: 'America/Los_Angeles',
			MT: 'America/Denver',
			ID: 'America/Denver',
			WY: 'America/Denver',
			UT: 'America/Denver',
			CO: 'America/Denver',
			AZ: 'America/Denver',
			NM: 'America/Denver',
			ND: 'America/Chicago',
			SD: 'America/Chicago',
			MN: 'America/Chicago',
			WI: 'America/Chicago',
			NE: 'America/Chicago',
			IA: 'America/Chicago',
			IL: 'America/Chicago',
			KS: 'America/Chicago',
			MO: 'America/Chicago',
			OK: 'America/Chicago',
			AR: 'America/Chicago',
			TX: 'America/Chicago',
			LA: 'America/Chicago',
			MS: 'America/Chicago',
			AL: 'America/Chicago',
			MI: 'America/New_York',
			NY: 'America/New_York',
			VT: 'America/New_York',
			NH: 'America/New_York',
			ME: 'America/New_York',
			MA: 'America/New_York',
			CT: 'America/New_York',
			RI: 'America/New_York',
			IN: 'America/New_York',
			OH: 'America/New_York',
			PA: 'America/New_York',
			NJ: 'America/New_York',
			KY: 'America/New_York',
			WV: 'America/New_York',
			VA: 'America/New_York',
			DC: 'America/New_York',
			MD: 'America/New_York',
			DE: 'America/New_York',
			TN: 'America/New_York',
			NC: 'America/New_York',
			GA: 'America/New_York',
			SC: 'America/New_York',
			FL: 'America/New_York',
			HI: 'Pacific/Honolulu',
			AK: 'America/Anchorage'
		};
		const state = location.substr(-2, 2);
		return timezones[state];
	}

	//Turn scraped strings into appropriate format for INSERT into database tournament table
	formatTournamentInsert = (date, division, event_name, location, event_url) => {
		//date can handle the following formats "9/16-9/17", "9/4 - 9/5", and "9/8"
		//also there is an odd character that looks like a dash but is not so that is replaced
		date = date.replace(/\s/g,'')
		date = date.replace(/–/g,'-')
		const start_date = this.sqlDateFromString(date.split("-")[0]);
		var end_date;
		if (date.split("-")[1]) {
			end_date = this.sqlDateFromString(date.split("-")[1]);
		} else {
			end_date = start_date;
		}
		const division_id = Division.createFromString(division).getId();
		const timezone = this.getTimeZone(location);
	
		// If the tournament already exists do not add it
		// TODO maybe deal with USAU changing the date of a tournament
		return `INSERT INTO tournaments (division_id, start_date, end_date, name, location, url, timezone) 
				VALUES (${division_id}, '${start_date}', '${end_date}', '${event_name}', '${location}', '${event_url}', '${timezone}')
				ON CONFLICT (division_id, url) DO NOTHING`;
	}

	formatGameInsert = async (tournamentId, date, time, timezone, team1, team2, division) => {
		//Cut off final word which is always the seed to leave just the team name
		const team1NoSeed = team1.substring(0, team1.lastIndexOf(" "));
		const team2NoSeed = team2.substring(0, team2.lastIndexOf(" "));

		const team1Id = await Team.getId(team1NoSeed, division, this.pool);
		const team2Id = await Team.getId(team2NoSeed, division, this.pool);
		//TODO make sure this doesnt break near new year
		const currYear = new Date().getFullYear();

		//date is in the form 'DOW M(M)/D(D)' e.g. 'Sat 4/30' or 'M(M)/D(D)/YYYY' e.g. '4/30/2022'
		const monthDay = date.substring(date.lastIndexOf(" ") + 1); //Cut off day word if any
		const [month, day] = monthDay.split("/").map(element => parseInt(element, 10));

		//TODO adjust to timezone of tournament
		const time24h = this.convertTime12to24(time);
		const [hours, minutes] = time24h.split(":").map(element => parseInt(element, 10));

		const datetime = DateTime.local(currYear, month, day, hours, minutes, { zone: timezone });
		const databaseTimestamp = datetime.toSQL();
		return `INSERT INTO games (tournament_id, team1_id, team2_id, start_time) 
		VALUES (${tournamentId}, ${team1Id}, ${team2Id}, '${databaseTimestamp}')
		ON CONFLICT (team1_id, team2_id, start_time, tournament_id) DO NOTHING`;
	}


	getTournaments = async () => {
		try {
			//connect to database
			const client = await this.pool.connect();
	
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
					if (date == "tba") {
						//continues to next entry if the date is tba
						return true;
					}
					try {
						const insert_query = 
						this.formatTournamentInsert(date, division, event_name, location, event_url);
						await client.query(insert_query);
					} catch(error) {
						console.log(error);
					}
				});
			await client.release();
		} catch (error) {
			throw error;
		}
	};

	//Scrape tournament schedule for specified tournament
	//Returns the date of the earliest game in need of updated data
	getSchedule = async (tournament_id) => {
		var updateNeeded = null;
		try {
			//connect to database
			const client = await this.pool.connect();
			const selectString = `SELECT * FROM tournaments WHERE id = ${tournament_id}`
			const tournamentQuery = await client.query(selectString);
			const tournament = tournamentQuery.rows[0];

			const division = Division.createFromId(tournament.division_id);
			const url = tournament.url;
			const timezone = tournament.timezone;
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
				case Division.mixed:
					fullUrl = fullUrl + "/mixed/College-Mixed/";
					break;
				default:
					`division ${division.id} is unknown`
			}

			//get html for USA Ultimate schedule site
			const { data } = await axios.get(fullUrl);

			const $ = cheerio.load(data);
			//each table row represents one tournament (both past and future)
			const normal_games = $('.scores_table > tbody > tr:not(:first-child)').toArray();
			for (const game of normal_games) {
				const day = $(game).find("td:eq(0)").text().trim();
				const time = $(game).find("td:eq(1)").text().trim();
				const team1 = $(game).find("td:eq(3)").text().trim();
				const team2 = $(game).find("td:eq(4)").text().trim();
				//TBD if a team is of the form "W of ...", "W of ...", or "P2 of ..."
				const isTBD = (/^(W|L|P\d) of /.test(team1) || /^(W|L|P\d) of /.test(team2));
				if (isTBD) {
					const datetime = day.substring(day.indexOf(' ') + 1) + ' ' + time;
					const updateAt = DateTime.fromFormat(datetime, 'M/d h:mm a');

					if (!updateNeeded || updateNeeded > updateAt) {
						updateNeeded = updateAt;
					}
				}
				else {
					try {
						const insert_query = 
							await this.formatGameInsert(tournament_id, day, time, timezone, team1, team2, division);
						await client.query(insert_query);
					} catch(error) {
						console.log(error);
					}
				}
			}
			const bracket_games = $('.bracket_game').toArray();
			for (const game of bracket_games) {
				const datetime = $(game).find('.date').text().trim();
				const date = datetime.substring(0, datetime.indexOf(' ')); // datetime until the first space
				const time = datetime.substring(datetime.indexOf(' ') + 1); // datetime after the first space
				const team1 = $(game).find('.top_area > .isName').text().trim();
				const team2 = $(game).find('.btm_area > .isName').text().trim();
				//TBD if a team is of the form "W of ...", "W of ...", or "P2 of ..."
				const isTBD = (/^(W|L|P\d) of /.test(team1) || /^(W|L|P\d) of /.test(team2));
				if (datetime == "TBA") {
					continue;
				}
				else if (isTBD) {
					const updateAt = DateTime.fromFormat(datetime, 'M/d/yyyy h:mm a', {zone: timezone});
					if (!updateNeeded || updateNeeded > updateAt) {
						updateNeeded = updateAt;
					}
				}
				else {
					try {
						const insert_query = 
							await this.formatGameInsert(tournament_id, date, time, timezone, team1, team2, division);
						await client.query(insert_query);
					} catch(error) {
						console.log(error);
					}
				}
			}
	
			await client.release();
		} catch (error) {
			throw error;
		}
		return updateNeeded;
	};
};

// Division enum maps each division to its integer id
class Division {
	// Create new instances of division as static attributes to act as enum
	static D1_women = new Division(1);
	static D3_women = new Division(2);
	static D1_men = new Division(3);
	static D3_men = new Division(4);
	static mixed = new Division(5);
  
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
			case 'Mixed':
			case 'College Mixed':
				return this.mixed;
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
			case 5:
				return this.mixed;
			default:
				throw `${divId} is not a division ID`;
		}
	}
}

// Team class provides functionality related to the teams database table
class Team {
	//Gets the ID of given team if not in table adds to table
	static async getId(teamName, division, pool) {
		//connect to database
		const client = await pool.connect();
		const selectQuery = `SELECT id FROM teams WHERE usau_name = 
							'${teamName}' AND division_id = ${division.id}`;
		var data = await client.query(selectQuery);
		if (data.rowCount == 0) {
			//TODO try to fetch twitter handle from twitter API
			const insertQuery = `INSERT INTO teams(division_id, usau_name) 
								VALUES(${division.id}, '${teamName}') RETURNING id`;
			//Returns new id as if we selected it
			data = await client.query(insertQuery);
		}
		//disconnect to database
		await client.release();
		return data.rows[0].id;
	}
}

module.exports = WebScraper;

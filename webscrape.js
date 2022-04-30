const axios = require('axios')
const cheerio = require('cheerio');

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

//Scrape tournaments from USA ultimate website and insert into tournament table
//TODO safer db connect/unconnect and better error handling
const getTournaments = async () => {
	try {
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

getTournaments()
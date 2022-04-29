const axios = require('axios')
const cheerio = require('cheerio');

const getTournaments = async () => {
	try {
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
		    .each((i, element) => {
				console.log($(element).find('td.date').ignore("span").text().trim());
				console.log($(element).find('td.division').ignore("span").text().trim());
				console.log($(element).find('td.event').ignore("span").text().trim());
				console.log($(element).find('td.location').ignore("span").text().trim());
				//link to detailed schedule page
				console.log($(element).find('td.results > a').attr('href'));
		    });
	} catch (error) {
		throw error;
	}
};

getTournaments()
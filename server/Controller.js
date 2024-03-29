const TwitterManager = require('./TwitterManager');
const Database = require('./Database');
const Scheduler = require('./Scheduler')
const WebScraper = require('./WebScraper')

// Class to scrape all data needed (mostly tournament schedules)
class Controller {
	static async startBackend(io) {
		const database = new Database;
		io.on("connect", async () => {
			const json = await database.getStartupData();
			io.emit("init", json);
		  });
		const token = process.env.BEARER_TOKEN;
		const twitter = new TwitterManager(io, token, database.pool);
		//Always add ultiworld live
		twitter.addGame(0, 'Ultiworldlive', 'scores_ultimate');
		await twitter.startStream();
		const scraper = new WebScraper(database.pool);
		const scheduler = new Scheduler(twitter, scraper, database.pool);
		await scheduler.startScheduler();
	}

}

module.exports = Controller;
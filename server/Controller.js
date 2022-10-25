const TwitterManager = require('./TwitterManager');
const pool = require('./database');
const Scheduler = require('./Scheduler')
const WebScraper = require('./WebScraper')

// Class to scrape all data needed (mostly tournament schedules)
class Controller {
	static async startBackend(io) {
		const token = process.env.BEARER_TOKEN;
		const twitter = new TwitterManager(io, token, pool);
		//twitter.addAccount('scores_ultimate', 3);
		//twitter.addAccount('Every3Minutes', 4);
		await twitter.startStream();
		const scraper = new WebScraper(pool);
		const scheduler = new Scheduler(twitter, scraper, pool);
		await scheduler.startScheduler();
	}

}

module.exports = Controller;
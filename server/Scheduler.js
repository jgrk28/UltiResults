const schedule = require('node-schedule');
const { DateTime } = require('luxon');

// Manages all scheduled events using the Webscraper and TwitterManager
class Scheduler {
	constructor(twitter, scraper, pool) {
		this.twitter = twitter;
		this.scraper = scraper;
		this.pool = pool;
		this.twitterHandles = new Map();
		this.tounamentJobs = new Map();
	}

	// Get twitter for given team ID and cache fetched data in this.twitterHandles
	async getTwitter(teamId) {
		if (!this.twitterHandles.has(teamId)) {
			// If the twitter for the given team id is not cached retrieve from database first
			const teamQuery = `SELECT * FROM teams WHERE id = '${teamId}'`;
			await this.pool
				.query(teamQuery)
				.then(res => {
					this.twitterHandles.set(teamId, res.rows[0].twitter);
				})
				.catch(err => console.error('Error executing query', err.stack))
		}
		return this.twitterHandles.get(teamId);
	}

	// TODO maybe more efficient to pass in accounts instead of ids
	async addTwitters(teamIds) {
		for (const teamId of teamIds) {
			const account = await this.getTwitter(teamId);
			this.twitter.addAccount(account, teamId);
		}
		this.twitter.updateRule();
	}

	async removeTwitters(teamIds) {
		for (const teamId of teamIds) {
			const account = await this.getTwitter(teamId);
			this.twitter.removeAccount(account);
		}
		this.twitter.updateRule();
	}

	async initTournamentTwitters(tournamentId, end_date) {
		//Follow all games that are playing now or in this tournament in the future
		// TODO make a better guess if the game is still going on
		const earliestTime = DateTime.now().minus({minutes: 90}).toSQL();
		const gamesQuery = `SELECT * FROM games WHERE tournament_id = '${tournamentId}' AND start_time > '${earliestTime}'`;
		var teams = new Set();
		await this.pool
			.query(gamesQuery)
  			.then(res => {
				for(const game of res.rows) {
					teams.add(game.team1_id);
					teams.add(game.team2_id);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
		this.addTwitters(teams);

		// Assumption here is that teams will not start another tournament before this tournament is over
		const tournament_end = new DateTime(end_date).plus({hours: 23, minutes: 59});
		schedule.scheduleJob(tournament_end, async () => {
			this.removeTwitters(teams);
		});
	}

	async scrapeTournament(tournament_id) {
		const updateDate = await this.scraper.getSchedule(tournament_id);
		//TODO stop fully scraping the tournament each time as this is very inefficient (might also not work when USAU is slow)
		//maybe can use the relationships given in the bracket structure to provide our own answer to who is playing
		if (updateDate) {
			schedule.scheduleJob(updateDate, () => {
				this.scrapeTournament(tournament_id);
			});
		}
	}

	initTournamentSchedule() {
		const currentDate = DateTime.now().toSQLDate();
		const upcomingTournamentsQuery = `SELECT * FROM tournaments WHERE start_date > '${currentDate}'`
  
		this.pool
			.query(upcomingTournamentsQuery)
  			.then(res => {
				for(const tournament of res.rows) {
					schedule.scheduleJob(tournament.start_date, async () => {
  						console.log('What to do if there is a tournament.');
						await this.scrapeTournament(tournament.id);
						this.initTournamentTwitters(tournament.id, tournament.end_date);
					});
					this.tounamentJobs.set(tournament.id, job);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	checkOngoingTournaments() {
		const currentDate = DateTime.now().toSQLDate();
		const ongoingTournamentsQuery = `SELECT * FROM tournaments WHERE start_date <= '${currentDate}' AND end_date >= '${currentDate}'`
  
		this.pool
			.query(ongoingTournamentsQuery)
  			.then(async(res) => {
				for(const tournament of res.rows) {
					await this.scrapeTournament(tournament.id);
					this.initTournamentTwitters(tournament.id, tournament.end_date);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	async startScheduler() {
		await this.scraper.getTournaments();
		this.initTournamentSchedule();
		this.checkOngoingTournaments();

		//Updates the tournament schedule each week on wednesday at 5pm
		schedule.scheduleJob('0 17 * * 3', () => {
			console.log('Getting season schedule');
			const changed = this.scraper.getTournaments();
			//TODO add new jobs
			//TODO update this.tournamentJobs with changes to schedule
		});
	}
};

module.exports = Scheduler;
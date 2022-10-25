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
		this.gameJobs = new Map();
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

	async startGame(team1Id, team2Id) {
		const account1 = await this.getTwitter(team1Id);
		const account2 = await this.getTwitter(team2Id);
		this.twitter.addAccount(account1, team1Id);
		this.twitter.addAccount(account2, team2Id);
		//Make sure you are calling this.twitter.updateRule after all startGame calls have finished
	}

	async initGamesSchedule(tournamentId) {
		const currentTime = DateTime.now().toSQL();
		const gamesQuery = `SELECT * FROM games WHERE tournament_id = '${tournamentId}' AND start_time > '${currentTime}'`;
  
		await this.pool
			.query(gamesQuery)
  			.then(res => {
				for(const game of res.rows) {
					const job = schedule.scheduleJob(game.start_time, async () => {
  						console.log('What to do if there is a game.');
						await this.startGame(game.team1_id, game.team2_id);
						// TODO is there a way to all this update after the chunk that all start at the same time
						// sort into same time chunks then put a for loop in here
						await this.twitter.updateRule();
					});
					this.gameJobs.set(game.id, job);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	async startOngoingGames(tournamentId) {
		// If we are within 1.5 hours of the start time assume the game is still going on
		// TODO make a better guess if the game is still going on
		const earliestTime = DateTime.now().minus({minutes: 90}).toSQL();
		const currentTime = DateTime.now().toSQL();
		const gamesQuery = `SELECT * FROM games WHERE tournament_id = '${tournamentId}' 
							AND start_time > '${earliestTime}'
							AND start_time < '${currentTime}'`;
  
		await this.pool
			.query(gamesQuery)
  			.then(async (res) => {
				for(const game of res.rows) {
					await this.startGame(game.team1_id, game.team2_id);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
		await this.twitter.updateRule();
	}

	async startTournament(tournament_id) {
		await this.scraper.getSchedule(tournament_id);
		this.initGamesSchedule(tournament_id);
		this.startOngoingGames(tournament_id);
	}

	async initTournamentSchedule() {
		const currentDate = DateTime.now().toSQLDate();
		const upcomingTournamentsQuery = `SELECT * FROM tournaments WHERE start_date > '${currentDate}'`
  
		await this.pool
			.query(upcomingTournamentsQuery)
  			.then(res => {
				for(const tournament of res.rows) {
					const job = schedule.scheduleJob(tournament.start_date, () => {
  						console.log('What to do if there is a tournament.');
						this.startTournament(tournament.id);
					});
					this.tounamentJobs.set(tournament.id, job);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	async checkOngoingTournaments() {
		const currentDate = DateTime.now().toSQLDate();
		const ongoingTournamentsQuery = `SELECT * FROM tournaments WHERE start_date <= '${currentDate}' AND end_date >= '${currentDate}'`
  
		await this.pool
			.query(ongoingTournamentsQuery)
  			.then(res => {
				for(const tournament of res.rows) {
					this.startTournament(tournament.id);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	async startScheduler() {
		await this.scraper.getTournaments();
		this.initTournamentSchedule();
		this.checkOngoingTournaments();

		//Updates the tournament schedule each week on wednesday at 5pm
		const job = schedule.scheduleJob('0 17 * * 3', () => {
			console.log('Getting season schedule');
			const changed = this.scraper.getTournaments();
			//TODO add new jobs
			//TODO update this.tournamentJobs with changes to schedule
		});
	}
};

module.exports = Scheduler;
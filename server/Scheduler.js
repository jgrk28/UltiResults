const { scheduleJob } = require('node-schedule');
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

	async initTournamentTwitters(tournamentId, end_date) {
		//Follow all games that are playing now or in this tournament in the future
		// TODO make a better guess if the game is still going on
		const earliestTime = DateTime.now().minus({minutes: 90}).toSQL();
		const gamesQuery = 
		`SELECT
		games.id as id,
		t1.twitter as team1_twitter, 
		t2.twitter as team2_twitter 
		FROM games 
		JOIN teams t1 on team1_id=t1.id 
		JOIN teams t2 on team2_id=t2.id
		WHERE tournament_id = '${tournamentId}' AND start_time > '${earliestTime}'`;
		var gameIds = new Set();
		await this.pool
			.query(gamesQuery)
  			.then(res => {
				for(const game of res.rows) {
					this.twitter.addGame(game.id, game.team1_twitter, game.team2_twitter);
					gameIds.add(game.id);
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
		await this.twitter.updateRules();

		// Assumption here is that teams will not start another tournament before this tournament is over
		const tournament_end = DateTime.fromISO(end_date, {zone: "America/New_York"}).plus({hours: 23, minutes: 59});
		const job = scheduleJob(tournament_end.toJSDate(), async () => {
			this.removeGames(gameIds);
			await this.twitter.updateRules();
		});
		if(job) {
			console.log(`remove tournament(${tournamentId}) twitters time`);
			console.log(job.nextInvocation());
		} else {
			console.log(`remove tournament(${tournamentId}) twitters not scheduled properly, it the time in the past?`);
		}
	}

	async scrapeTournament(tournament_id, tournament_end) {
		const nextTBADate = await this.scraper.getSchedule(tournament_id);
		//TODO stop fully scraping the tournament each time as this is very inefficient (might also not work when USAU is slow)
		//maybe can use the relationships given in the bracket structure to provide our own answer to who is playing
		
		var updateDate;
		const fiveMins = DateTime.now().plus({minutes: 5});
		const ninetyMinsAgo = DateTime.now().minus({hours: 1, minutes: 30});
		//set next update to 5 minutes if there is a current game that is not updating
		//otherwise set to the time of the next TBA game
		if (!nextTBADate || nextTBADate > fiveMins) {
			updateDate = nextTBADate;
		} else if (nextTBADate > ninetyMinsAgo) {
			updateDate = fiveMins;
		} else {
			updateDate = null;
		}

		if (updateDate) {
			const job = scheduleJob(updateDate.toJSDate(), () => {
				this.scrapeTournament(tournament_id, tournament_end);
			});
			if(job) {
				console.log(`update tournament(${tournament_id}) time`);
				console.log(job.nextInvocation());
			} else {
				console.log(`update tournament(${tournament_id}) not scheduled properly, it the time in the past?`);
			}
		}
		await this.initTournamentTwitters(tournament_id, tournament_end);
	}

	initTournamentSchedule() {
		const currentDate = DateTime.now().setZone("America/New_York").toSQLDate();
		const upcomingTournamentsQuery = 
		`SELECT 
		id, 
		to_char(start_date, 'YYYY-MM-DD') as start_date,
		to_char(end_date, 'YYYY-MM-DD') as end_date
		FROM tournaments WHERE start_date > '${currentDate}'`
  
		this.pool
			.query(upcomingTournamentsQuery)
  			.then(res => {
				for(const tournament of res.rows) {
					const scrapeTime = DateTime.fromISO(tournament.start_date, {zone: "America/New_York"});
					scheduleJob(scrapeTime.toJSDate(), async () => {
						await this.scrapeTournament(tournament.id, tournament.end_date);
					});
					//TODO update the job made if the tournament changes
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	checkOngoingTournaments() {
		const currentDate = DateTime.now().setZone("America/New_York").toSQLDate();
		//for testing
		//const currentDate = DateTime.utc(2023, 3, 4).toSQLDate();

		const ongoingTournamentsQuery =
		`SELECT 
		id, 
		name, 
		to_char(start_date, 'YYYY-MM-DD') as start_date,
		to_char(end_date, 'YYYY-MM-DD') as end_date
		FROM tournaments 
		WHERE start_date <= '${currentDate}' 
		AND end_date >= '${currentDate}' 
		AND do_stream = TRUE`
  
		this.pool
			.query(ongoingTournamentsQuery)
  			.then(async(res) => {
				for(const tournament of res.rows) {
					await this.scrapeTournament(tournament.id, tournament.end_date);				
				}
			})
  			.catch(err => console.error('Error executing query', err.stack))
	}

	async startScheduler() {
		await this.scraper.getTournaments();
		this.initTournamentSchedule();
		this.checkOngoingTournaments();

		//Updates the tournament schedule each week on wednesday at 5pm
		scheduleJob('0 17 * * 3', () => {
			console.log('Updating season schedule');
			const changed = this.scraper.getTournaments();
			//TODO add new jobs
			//TODO update this.tournamentJobs with changes to schedule
		});
	}
};

module.exports = Scheduler;
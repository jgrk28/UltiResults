const axios = require('axios');
const Qs = require('qs');
const Parser = require('./Parser');

class Game {
    constructor(team1_twitter, team2_twitter) {
		this.team1_twitter = team1_twitter;
        this.team2_twitter = team2_twitter;
    }
}

// Manages the twitter stream by adding and removing accounts
// Emits all recived tweets on the socket given in the constructor
class TwitterManager {
	constructor(socket, token, pool) {
		this.socket = socket;
		this.token = token;
		this.pool = pool;
		this.games = new Map();
		this.ruleId = 0;
		// these should be static variable but that is giving an error
		this.rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
		this.streamURL = 'https://api.twitter.com/2/tweets/search/stream';
		this.timeout = 1;
		this.namesToId = new Object();
	}

	async getAllNames() {
		const query = `SELECT id,usau_name,twitter FROM teams`;
		const res = await this.pool.query(query);
		for(const team of res.rows) {
			if (team.usau_name) {
				this.namesToId[team.usau_name] = team.id;
			}
			if (team.twitter) {
				this.namesToId[team.twitter] = team.id;
			}
		}
	}

	addGame(gameId, twitter1, twitter2) {
		this.games.set(gameId, new Game(twitter1, twitter2));
	}

	removeGame(gameId) {
		this.games.delete(gameId);
	}

	removeGames(gameIds) {
		gameIds.forEach((gameId) => {
			this.removeGame(gameId);
		})
	}

	// builds rules to track all tweets from all accounts in this.accounts
	createRuleValues() {
		let ruleValues = [];
		let charCount = 0;
		let ruleValue = "";

		let accounts = new Set()
		for (const game of this.games.values()) {
			if (game.team1_twitter) {
				accounts.add(game.team1_twitter);
			}
			if (game.team2_twitter) {
				accounts.add(game.team2_twitter);
			}
		}
		//loop through all the accounts to put them in a rule
		accounts.forEach((account) => {
			charCount += 9;
			charCount += account.length;
			//if we are mid rule and have not reached the character limit
			if (charCount <= 512 && ruleValue != "") {
				ruleValue += " OR from:" + account;
			} else {
				//if there is a rule that means it has reached the character limit
				if (ruleValue != "") {
					ruleValues.push(ruleValue);
				}
				//start a new rule (no OR)
				ruleValue = "from:" + account;
				charCount = 5 + account.length;
			} 
		});
		//add the last (not fully filled) rule value
		ruleValues.push(ruleValue);
		return ruleValues;
	}

	// adds the given rule to the twitter streaming rules API
	async addRule(ruleValue) {
		const rules = [{
			'value': ruleValue,
			'tag': 'live ulti results'
		}];
		const data = {
			'add': rules
		};

		const response = await axios.post(this.rulesURL, data, {
			headers: {
				"content-type": "application/json",
				"authorization": `Bearer ${this.token}`
			}
		})

		if (response.status == 200) {
			console.log("no rule added");
			return 0;
		} else if (response.status !== 201) {
			console.error(`Error: ${response.statusText} ${response.status}`)
			throw new Error(response.data);
		}
		
		if (response.data.errors) {
			for (var i = 0; i < response.data.errors.length; i++) {
				console.log(response.data.errors[i].title);
				return 0;
			}
		} else {
			//for now we are always only going to have 1 rule
			const rule = response.data.data[0];

			console.log("rules successfully set");
			console.log(ruleValue);
			return rule.id;
		}
	}

	// removes the speciefied rule from the twitter streaming rules API
	async deleteRule(id) {
		const data = {
			"delete": {
				"ids": [id]
			}
		};

		const response = await axios.post(this.rulesURL, data, {
			headers: {
				"content-type": "application/json",
				"authorization": `Bearer ${this.token}`
			}
		})

		if (response.status !== 201) {
			console.error(`Error deleting: ${response.statusText} ${response.status}`);
			throw new Error(response.data);
		}

		console.log("rule successfully deleted");
	}

	// deletes all rules, useful to run at startup because the twitter API does
	// not remove your rules when you disconnect
	async deleteAllRules() {

		const getResponse = await axios.get(this.rulesURL, {
			headers: {
				"authorization": `Bearer ${this.token}`
			}
		})
	
		if (getResponse.status !== 200) {
			console.error(`Error getting rules: ${getResponse.statusText} ${getResponse.status}`)
			throw new Error(getResponse.data);
		}
	
		const rules = getResponse.data;
	
		if (!Array.isArray(rules.data)) {
			return null;
		}
	
		const ids = rules.data.map(rule => rule.id);
	
		const data = {
			"delete": {
				"ids": ids
			}
		}
	
		const postResponse = await axios.post(this.rulesURL, data, {
			headers: {
				"content-type": "application/json",
				"authorization": `Bearer ${this.token}`
			}
		})
	
		if (postResponse.status !== 200) {
			console.error(`Error deleting all: ${postResponse.statusText} ${postResponse.status}`)
			throw new Error(postResponse.data);
		} else {
			console.log("rules all successfully deleted");
		}
	
		return (postResponse.data);
	}

	// updates the streaming rules based on the current contents of this.games
	async updateRules() {
		
		// make new rules
		const ruleValues = this.createRuleValues();
		try {
			// delete all old rules
			await this.deleteAllRules();
			
			ruleValues.forEach(async (rule) => {
				await this.addRule(rule);
			});
			
		} catch (e) {
			console.error(e);
		}	
	}

	// starts the stream, rules can still be updated while the stream is running
	async startStream() {
		await this.updateRules();
		try {
			const response = await axios.get(this.streamURL, {
				headers: {
					"User-Agent": "UltiResults",
					"Authorization": `Bearer ${this.token}`
				},
				params: { 
					tweet: {fields: 'created_at,conversation_id'},
					expansions: 'author_id' 
				},
				paramsSerializer: (params) => {
					return Qs.stringify(params, {allowDots: true});
				},
				timeout: 25000,
				responseType: 'stream'
			});

			const stream = response.data;

			stream
				.on("data", (data) => {
					try {
						const json = JSON.parse(data);
						if (json.connection_issue) {
							console.log("connection issue" + JSON.stringify(json));
							reconnect(stream);
						} else {
							if (json.data) {
								//set gameId so that front end can access
								this.getGameId(json)
									.then(gameId => {
										console.log(this.games)
										if(gameId !== null) {
											const game = this.games.get(gameId);
											const tweeter = json.includes.users[0].username;
											let score = null;
											if (tweeter === game.team1_twitter) {
												score = Parser.parseScore(json.data.text, true)
											} else if (tweeter === game.team2_twitter) {
												score = Parser.parseScore(json.data.text, false)
											} else {
												//Must be an ultiworld tweet
												if (tweeter != "Ultiworldlive") {
													console.log(`Tweeter ${tweeter} not in this game`)
												}
											}
											json.gameId = gameId;
											json.score = score;
										}
										this.socket.emit("tweet", json);
										this.saveTweet(json);
									})
							} else {
								console.error("authError" + JSON.stringify(json));
							}
						}
					} catch (e) {
						this.socket.emit("heartbeat");
					}
				})
				.on("error", (error) => {
					// Connection timed out
					console.error("stream error: " + error);
					this.reconnect(stream);
				});
		} catch (e) {
			console.error("start stream error: " + e);
		}
	}

	//TODO FIX make actually sleep
	async reconnect(stream) {
		console.log("attempting to reconnect");
		this.timeout++;
		stream.abort();
		await new Promise(r => setTimeout(r, this.timeout * 1000));
		this.startStream();
	}

	//Return a team id if the team is mentioned by name or twitter in tweet
	parseForTeam(tweetText) {
		//Make everything lower case so that we are case insensitive
		tweetText = tweetText.toLowerCase();
		for (const [keyword, team_id] of Object.entries(this.namesToId)) {
			if (tweetText.includes(keyword.toLowerCase())) {
				return team_id;
			}
		}
		return null;
	}

	//Return a game id if the given team is playing at the time of the tweets
	async findGame(teamId, tweetTime) {
		const query = 
			`SELECT id FROM games 
			WHERE (team1_id=${teamId} OR team2_id=${teamId})
			AND ((start_time - interval '7 Minutes') < '${tweetTime}' 
				AND (start_time + interval '90 Minutes') > '${tweetTime}')`;
		try {
			const res = await this.pool.query(query);
			if (res.rows.length == 0) {
				return null;
			} else {
				//Assume only one game falls in the time range
				//TODO fix assumption
				return res.rows[0].id;
			}
		} catch (error) {
			console.error(`Error executing query: ${query} \nError: ${error}`);
		}
	}

	async parseForGame(tweetText, tweetTime) {
		const teamId = this.parseForTeam(tweetText);
		if (teamId === null) {
			return null;
		} else {
			return await this.findGame(teamId, tweetTime)
		}

	}

	//Checks if the thread has already been assigned to a game
	//If not tries to parse and then sets the rest of the thread if found
	async parseThreadForGame(conversationId, tweetText, tweetTime) {
		const tweetQuery = 
		`SELECT game_id FROM tweets 
		WHERE id=${conversationId}`;
		try {
			const res = await this.pool.query(tweetQuery);
			if (res.rows.length == 0) {
				return null;
			} else if (res.rows[0].game_id) {
				return res.rows[0].game_id;{
			}
			} else {
			//Thread exists but has not yet been assigned to a game
				let gameId = await this.parseForGame(tweetText, tweetTime);
				if (gameId) {
					//Set all tweets for this thread to the game found
					//TODO tell socket that frontend should grab tweets again
					const updateQuery = 
					`UPDATE tweets SET game_id=${gameId}
					WHERE root_tweet=${conversationId}`;
					await this.pool.query(updateQuery)
				}
				return gameId;
			}
		} catch (error) {
			console.error(`Error executing query: ${tweetQuery} \nError: ${error}`);
		}
	}

	async getGameId(tweet) {
		if (Object.keys(this.namesToId).length == 0) {
			await this.getAllNames();
		}
		const author = tweet.includes.users[0].username;
		const teamId = this.namesToId[author];
		const tweetTime = tweet.data.created_at;
		//For now hardcode ultiworld live as the only account that is not a team
		//TODO update system to be able to handle more fan tweeters
		if(author === 'Ultiworldlive' || author === 'scores_ultimate') {
			//if it is a reply, it is most likely from a thread
			if(tweet.data.conversation_id != tweet.data.id) {
				return await this.parseThreadForGame(tweet.data.conversation_id, tweet.data.text, tweetTime)
			} else {
				return await this.parseForGame(tweet.data.text, tweetTime);
			}
		} else {
			//Otherwise search for ongoing game where one of the teams is the tweeter
			return await this.findGame(teamId, tweetTime);
		}
	}

	async saveTweet(tweet) {
		//author_id is twitter defined
		if (Object.keys(this.namesToId).length == 0) {
			await this.getAllNames();
		}
		const author = tweet.includes.users[0].username;
		const teamId = this.namesToId[author];

		const insertQuery = `INSERT INTO tweets(id, team_id, game_id, time, tweet, root_tweet) VALUES($1, $2, $3, $4, $5, $6)`;
		const insertValues = [tweet.data.id, teamId, tweet.gameId, tweet.data.created_at, tweet.data.text, tweet.data.conversation_id];
		this.pool
			.query(insertQuery, insertValues)
  			.catch(err => console.error(`Error executing query: ${insertQuery} \nError: ${err}`));
	}
};

module.exports = TwitterManager;
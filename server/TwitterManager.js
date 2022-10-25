const axios = require('axios');
const Qs = require('qs');

// Manages the twitter stream by adding and removing accounts
// Emits all recived tweets on the socket given in the constructor
class TwitterManager {
	constructor(socket, token, pool) {
		this.socket = socket;
		this.token = token;
		this.pool = pool;
		this.accounts = new Map();
		this.ruleId = 0;
		// these should be static variable but that is giving an error
		this.rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
		this.streamURL = 'https://api.twitter.com/2/tweets/search/stream';
	}

	addAccount(newAccount, teamId) {
		this.accounts.set(newAccount, teamId);
	}

	removeAccount(toRemove) {
		this.accounts.delete(toRemove);
	}

	// builds a rule to track all tweets from all accounts in this.accounts
	createRuleValue() {
		let ruleValue = "";
		const numAccounts = this.accounts.size;
		let count = 0;
		this.accounts.forEach((id, account) => {
			ruleValue += "from:" + account;
			count += 1;
			if (count < numAccounts) {
				ruleValue += " OR ";
			}
		});
		return ruleValue;
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
			console.log("Error:", response.statusText, response.status)
			throw new Error(response.data);
		}

		//for now we are always only going to have 1 rule
		const rule = response.data.data[0];

		console.log("rules successfully set");
		console.log(ruleValue);
		return rule.id;
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
			console.log("Error:", response.statusText, response.status)
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
			console.log("Error:", getResponse.statusText, getResponse.status)
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
			console.log("Error:", postResponse.statusText, postResponse.status)
			throw new Error(postResponse.data);
		}
	
		return (postResponse.data);
	}

	// updates the streaming rule based on the current contents of this.accounts
	async updateRule() {
		// save old id to delete after new rule is added
		const oldId = this.ruleId;
		// add new rule
		const ruleValue = this.createRuleValue();
		try {
			if (!oldId) {
				// if first rule, deletes any rules from previous uses
				await this.deleteAllRules();
			}
			this.ruleId = await this.addRule(ruleValue);
			// delete old rule if there was one
			if (oldId) {
				await this.deleteRule(oldId);
			}	
		} catch (e) {
			console.error(e);
		}	
	}

	// starts the stream, rules can still be updated while the stream is running
	async startStream() {
		await this.updateRule();
		try {
			const response = await axios.get(this.streamURL, {
				headers: {
					"User-Agent": "UltiResults",
					"Authorization": `Bearer ${this.token}`
				},
				params: { 
					tweet: {fields: 'created_at'},
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
					console.log("data incomming")
					try {
						const json = JSON.parse(data);
						if (json.connection_issue) {
							this.socket.emit("error", json);
							reconnect(stream);
						} else {
							if (json.data) {
								this.socket.emit("tweet", json);
								console.log("tweet sent")
								this.saveTweet(json);
							} else {
								this.socket.emit("authError", json);
								console.log("error sent")
							}
						}
					} catch (e) {
						this.socket.emit("heartbeat");
					}
				})
				.on("error", (error) => {
					// Connection timed out
					this.socket.emit("error", errorMessage);
					this.reconnect(stream);
				});
		} catch (e) {
			this.socket.emit("authError", e);
		}
	}

	async reconnect(stream) {
		timeout++;
		stream.abort();
		await sleep(2 ** timeout * 1000);
		streamTweets(this.socket, this.token);
	}

	async saveTweet(tweet) {

		//author_id is twitter defined
		const author = tweet.includes.users[0].username;
		const teamId = this.accounts.get(author);
		const insertQuery = `INSERT INTO tweets(team_id, time, tweet, id) VALUES($1, $2, $3, $4) RETURNING id`;
		const insertValues = [teamId, tweet.data.created_at, tweet.data.text, tweet.data.id];
		this.pool
			.query(insertQuery, insertValues)
  			.then(res => console.log(res.rows[0].teamId))
  			.catch(err => console.error('Error executing query', err.stack))
	}
};

module.exports = TwitterManager;
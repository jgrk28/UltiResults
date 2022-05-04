//The core of this code comes from https://github.com/twitterdev/Twitter-API-v2-sample-code
const axios = require('axios');
//Twitter API bearer token must first be set as an environmental variable
const token = process.env.BEARER_TOKEN;

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

// Filters which tweets to get
// For testing using this account as it posts every 3 mins
const rules = [{
        'value': 'from:Every3Minutes',
        'tag': 'live ulti results'
    }
];

async function getAllRules() {
    const response = await axios.get(rulesURL, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    })

    if (response.status !== 200) {
        console.log("Error:", response.statusText, response.status)
        throw new Error(response.data);
    }

    return (response.data);
}

async function deleteAllRules(rules) {

    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await axios.post(rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.status !== 200) {
        throw new Error(response.data);
    }

    return (response.data);

}

async function setRules() {

    const data = {
        'add': rules
    }

    const response = await axios.post(rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.status !== 201) {
        throw new Error(response.data);
    }

    return (response.data);

}

async function streamConnect(retryAttempt) {

    const response = await axios.get(streamURL, {
        headers: {
            "User-Agent": "UltiResults",
            "Authorization": `Bearer ${token}`
        },
        params: { expansions: 'author_id' },
        timeout: 25000,
        responseType: 'stream'
    });

    const stream = response.data;

    stream.on('data', data => { 
        try {
            const json = JSON.parse(data);
            console.log(json);
            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
                process.exit(1)
            } else {
                // Keep alive signal received. Do nothing.
            }
        }
    })

    stream.on('error', error => { 
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream. 
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });

    return stream;

}


(async () => {
    let currentRules;

    try {
        // Gets the complete list of rules currently applied to the stream
        currentRules = await getAllRules();

        // Delete all rules. Comment the line below if you want to keep your existing rules.
        await deleteAllRules(currentRules);

        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        await setRules();

    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    // Listen to the stream.
    streamConnect(0);
})();

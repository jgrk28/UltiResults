//The core of this code comes from https://github.com/twitterdev/Twitter-API-v2-sample-code
const axios = require('axios');

async function streamTweets(socket) {
    const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
    const streamURL = 'https://api.twitter.com/2/tweets/search/stream';
    //Twitter API bearer token must first be set as an environmental variable
    const token = process.env.BEARER_TOKEN;
    
    // Filters which tweets to get
    // For testing using this account as it posts every 3 mins
    const rules = [{
            'value': 'from:Every3Minutes',
            'tag': 'live ulti results'
        }
    ];
    const data = {
      'add': rules
    }
  
    console.log("setting rules")


    const response = await axios.post(rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })
  
    if (response.status !== 201) {
        throw new Error(response.data);
    }
    console.log("rules successfully set")
  
  
    let stream;
  
    const config = {
      url: streamURL,
      auth: {
        bearer: token,
      },
      timeout: 31000,
    };
  
    try {
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
  
      stream
        .on("data", (data) => {
          console.log("data incomming")
          try {
            const json = JSON.parse(data);
            if (json.connection_issue) {
              socket.emit("error", json);
              reconnect(stream, socket, token);
            } else {
              if (json.data) {
                socket.emit("tweet", json);
                console.log("tweet sent")
              } else {
                socket.emit("authError", json);
                console.log("error sent")
              }
            }
          } catch (e) {
            socket.emit("heartbeat");
          }
        })
        .on("error", (error) => {
          // Connection timed out
          socket.emit("error", errorMessage);
          reconnect(stream, socket, token);
        });
    } catch (e) {
      socket.emit("authError", e);
    }
}
  
const reconnect = async (stream, socket, token) => {
    timeout++;
    stream.abort();
    await sleep(2 ** timeout * 1000);
    streamTweets(socket, token);
}

(async () => {
    // Listen to the stream.
    //await streamTweets(socket);
})();

module.exports = { streamTweets };
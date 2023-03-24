import React from "react";
import TweetStream from "./TweetStream";
import { DateTime } from 'luxon';
import { Grid, Divider } from "semantic-ui-react";


//React component to display a table of games and their tweets
class Games extends React.Component {
  getAllTweets = (game) => {
    var allTweets = [...game.tweets];
		this.props.tweets.forEach(function (tweet, i) {
      const username = tweet.includes.users[0].username;
			if (tweet.gameId === game.id) {
				allTweets.unshift({
          twitter: username,
					tweet: tweet.data.text,
					id: tweet.data.id
				});
			}	
		});
    return allTweets
  }
  
	getTweetStream = (game) => {
		const tweetStreamData = this.getAllTweets(game);
		return <TweetStream tweets={tweetStreamData}/>
	}

  render() {
    return (
      <Grid stackable columns={2}>
        {this.props.gamesData.filter(game => {
          const currTime = DateTime.now({zone: 'utc'});
          //for testing only
          //const currTime = DateTime.utc(2023, 3, 4, 17);
          const gameTime = DateTime.fromISO(game.start_time);
          return (!this.props.liveFilter || (currTime < gameTime.plus({minutes: 90}) && currTime > gameTime))
            && (!this.props.hasTweetsFilter || this.getAllTweets(game).length > 0);
        }).map(game => {
          const gameTime = DateTime.fromISO(game.start_time);
          const displayTime = gameTime.toFormat('ccc h:mm a')
          return (
            <Grid.Column key={game.id} width={8}>
              <Divider horizontal style={{textTransform: "none"}}>
              {game.team1_name} vs {game.team2_name} | {displayTime}
              </Divider>
              {this.getTweetStream(game)}
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }
}

export default Games;
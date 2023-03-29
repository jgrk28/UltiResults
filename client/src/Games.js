import React from "react";
import TweetStream from "./TweetStream";
import { DateTime } from 'luxon';
import { Grid, Icon } from "semantic-ui-react";


//React component to display a table of games and their tweets
class Games extends React.Component {
  constructor(props) {
    super(props);

    let gameInfo = new Map();
    for (const game of this.props.gamesData) {
      let startingTweets = game.tweets;
      gameInfo.set(game.id, { 
        team1_score: game.team1_score,
        team2_score: game.team2_score,
        tweets: [...startingTweets.reverse()]
      });
    }

    this.state = {
      gameInfo: gameInfo
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.tweets !== prevProps.tweets) {
      this.props.tweets.filter(tweet => {
        return (!prevProps.tweets.includes(tweet));
      }).forEach(tweet => {
        const username = tweet.includes.users[0].username;
        if (!this.state.gameInfo.has(tweet.gameId)) {
          console.log(`tweet with no gameId recieved from ${username}`);
        }
        else {
          let newInfo = {};
          if (tweet.score !== null) {
            newInfo.team1_score = tweet.score.team1Score;
            newInfo.team2_score = tweet.score.team2Score;
          } else {
            newInfo.team1_score = this.state.gameInfo.get(tweet.gameId).team1_score;
            newInfo.team2_score = this.state.gameInfo.get(tweet.gameId).team2_score;
          }
          newInfo.tweets = this.state.gameInfo.get(tweet.gameId).tweets;
          newInfo.tweets.unshift({
            twitter: username,
            tweet: tweet.data.text,
            id: tweet.data.id
          })
          this.setState({ gameInfo: this.state.gameInfo.set(tweet.gameId, newInfo) });
        }
      })
    }
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
          const starIcon = this.props.starredGames.has(game.id) ? 
            <Icon name='star' onClick={e => this.props.starClick(e, game.id)}/> :
            <Icon name='star outline' onClick={e => this.props.starClick(e, game.id)}/>
          return (
            <Grid.Column key={game.id} width={8}>
              <Grid>
                <Grid.Row style={{padding: "0em"}}>
                  <Grid.Column floated="left" width={8}>
                    {displayTime}
                  </Grid.Column>
                  <Grid.Column floated="right" textAlign='right' width={8}>
                    {starIcon}
                  </Grid.Column>
                  
                </Grid.Row>
              </Grid>
              <Grid celled verticalAlign="middle">
                <Grid.Column width={5} textAlign= "center" style={{height: "100%"}}>
                  {game.team1_name}
                </Grid.Column>
                <Grid.Column width={6} textAlign="center" style={{fontSize: "2em", padding: ".5em"}}>
                  <b>
                  {this.state.gameInfo.get(game.id).team1_score} - {this.state.gameInfo.get(game.id).team2_score}
                  </b>
                </Grid.Column>
                <Grid.Column width={5} textAlign="center" style={{height: "100%"}}>
                  {game.team2_name}
                </Grid.Column>
              </Grid>
              <TweetStream tweets={this.state.gameInfo.get(game.id).tweets}/>
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }
}

export default Games;
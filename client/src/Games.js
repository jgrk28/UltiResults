import React, { Fragment } from "react";
import TweetStream from "./TweetStream";
import { DateTime } from 'luxon';


//React component to display a table of games and their tweets
class Games extends React.Component {
	getTweetStream = (game) => {
		var tweetStreamData = [...game.tweets];
    const gameTime = DateTime.fromISO(game.start_time, {zone: 'utc'});
		this.props.tweets.forEach(function (tweet, i) {
      const username = tweet.includes.users[0].username;
      const tweetTime = DateTime.fromISO(tweet.data.created_at, {zone: 'utc'});
      // TODO For now just checking if it was in the last 90 minutes to see if the game is going on
			if ((username === game.team1_twitter || username === game.team2_twitter) && tweetTime < gameTime.plus({minutes: 90}) && tweetTime > gameTime) {
				tweetStreamData.unshift({
          twitter: username,
					tweet: tweet.data.text,
					id: tweet.data.id
				});
			}	

		});
		return <TweetStream tweets={tweetStreamData}/>
	}

  render() {
    const columnDescriptions = [
      { display: 'Team 1', key: 'team1_name'},
      { display: 'Team 2', key: 'team2_name'},
      { display: 'Start Time', key: 'start_time'}
    ];
    return (

      <table className="games-table">
      <thead>
        <tr>
          {columnDescriptions.map((column) => {
            return <th key={column.key}>{column.display}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {this.props.gamesData.map((game) => {
          return (
            <Fragment key={game.id}>
            <tr key={game.id}>
              {columnDescriptions.map((column) => {
				return <td key={column.key}>{game[column.key]}</td>
              })}
            </tr>
			<tr>
			  <td colSpan="3">
			  	{this.getTweetStream(game)}
			  </td>
			</tr>
            </Fragment>
          )
        })}
      </tbody>
  </table>

    )
  }
}

export default Games;
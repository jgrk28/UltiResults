import React, { Fragment } from "react";
import TweetStream from "./TweetStream";


//React component to display a table of games and their tweets
class Games extends React.Component {
	getTweetStream = (game) => {
		//TODO figure out how to get team names cant json a Map
		const team1Twitter = this.props.teamsMap.get(game.team1_id.toString()).twitter;
		const team2Twitter = this.props.teamsMap.get(game.team2_id.toString()).twitter;
		var tweetStreamData = [...game.tweets];
		this.props.tweets.forEach(function (tweet, i) {
      const username = tweet.includes.users[0].username;
			if (username == team1Twitter || username == team2Twitter) {
				tweetStreamData.push({
					tweet: tweet.data.text,
					id: tweet.data.id
				});
			}	

		});
		return <TweetStream tweets={tweetStreamData}/>
	}

  render() {
    const columnDescriptions = [
      { display: 'Team 1', key: 'team1_id'},
      { display: 'Team 2', key: 'team2_id'},
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
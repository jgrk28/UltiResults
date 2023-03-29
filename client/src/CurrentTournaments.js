import React, { Fragment } from "react";
import { Accordion, Checkbox, Segment, Grid, Icon } from 'semantic-ui-react'
import { DateTime } from 'luxon';
import Games from "./Games";

//React component to display the current tournaments and their info
class CurrentTournaments extends React.Component {
  //TODO add cookie to keep starred games after reload
  state = { activeArray: new Set(), starredGames: new Set(), liveFilter: true, hasTweetsFilter: false }

  //handle accordion click
  handleClick = (e, titleProps) => {
    if (titleProps.active) {
      //remove from array then reset modified array as state
      this.state.activeArray.delete(titleProps.index)
      this.setState({ activeArray: this.state.activeArray})
    } else {
      this.setState({ activeArray: this.state.activeArray.add(titleProps.index) })
    }
  }

  //slider to filter live games only
  liveToggleClick = () => this.setState({liveFilter: !this.state.liveFilter})

  //slider to filter games that have tweets only
  tweetsToggleClick = () => this.setState({hasTweetsFilter: !this.state.hasTweetsFilter})

  //slider to filter games that have tweets only
  starClick = (e, gameId) => {
    if (this.state.starredGames.has(gameId)) {
      //remove from array then reset modified array as state
      this.state.starredGames.delete(gameId)
      this.setState({ starredGames: this.state.starredGames})
    } else {
      this.setState({ starredGames: this.state.starredGames.add(gameId) })
    }
  }

  render() {
    if (this.props.tournamentData.length === 0) {
      return (
        <div>
          There are no ongoing tournaments, please check back later.
        </div>
      )
    } else {
      const starredGameData = [];
      for (const tournament of this.props.tournamentData) {
        for (const game of tournament.games) {
          if (this.state.starredGames.has(game.id)) {
            starredGameData.push(game);
          }
        }
      }
      //TODO deal with case where this is an old game in starred but live filter is on
      const starredGamesSegment = starredGameData.length === 0 ? 
      <Segment> Star games to add them to this section </Segment> : 
      <Segment>
       <Games 
           gamesData={starredGameData} 
           tweets={this.props.tweets} 
           liveFilter={this.state.liveFilter} 
           hasTweetsFilter={this.state.hasTweetsFilter}
           starClick={this.starClick}
           starredGames={this.state.starredGames}/>
     </Segment>

      return (
        <Fragment>
          <Checkbox 
            slider 
            checked={this.state.liveFilter} 
            onClick={this.liveToggleClick} 
            label = "Live Only"
            style={{paddingBottom: "1em", paddingRight: "1em"}}/>
          <Checkbox 
            slider 
            checked={this.state.hasTweetsFilter} 
            onClick={this.tweetsToggleClick} 
            label = "Must Have Tweets"
            style={{paddingBottom: "1em", paddingRight: "1em"}}/>

          {starredGamesSegment}
          
          <Accordion fluid styled>
            {this.props.tournamentData.map((tournament, index) => {
              const startDate = DateTime.fromISO(tournament.start_date);
              const startFormat = startDate.toFormat("LLL d");
              const endDate = DateTime.fromISO(tournament.end_date);
              const endFormat = endDate.toFormat("LLL d");
              return (
                <Fragment key={tournament.id}>
                <Accordion.Title
                  active={this.state.activeArray.has(index)}
                  index={index}
                  onClick={this.handleClick}
                  style={{color: "black"}}
                >
                  <Grid>
                    <Grid.Column width={5}>
                      <Icon name='dropdown'/>
                      {tournament.name}
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {tournament.division_name}
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {tournament.location}
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="right">
                      {startFormat} - {endFormat}
                    </Grid.Column>
                  </Grid>
              </Accordion.Title>
              <Accordion.Content active={this.state.activeArray.has(index)}>
                <Games 
                  gamesData={tournament.games} 
                  tweets={this.props.tweets} 
                  liveFilter={this.state.liveFilter} 
                  hasTweetsFilter={this.state.hasTweetsFilter}
                  starClick={this.starClick}
                  starredGames={this.state.starredGames}/>
              </Accordion.Content>
              </Fragment>
              )
            })}
          </Accordion>
        </Fragment>
      )
    }
  }
}

export default CurrentTournaments;
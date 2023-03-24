import React, { Fragment } from "react";
import { Accordion, Checkbox, Grid, Icon } from 'semantic-ui-react'
import { DateTime } from 'luxon';
import Games from "./Games";

//React component to display the current tournaments and their info
class CurrentTournaments extends React.Component {
  state = { activeArray: new Set(), liveFilter: true, hasTweetsFilter: false}

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
  liveToggleClick = () =>
    this.setState((prevState) => (
      { 
        activeArray: this.state.activeArray,
        liveFilter: !prevState.liveFilter,
        hasTweetsFilter: prevState.hasTweetsFilter 
      }
    ))

    //slider to filter games that have tweets only
  tweetsToggleClick = () =>
  this.setState((prevState) => (
    { 
      activeArray: this.state.activeArray,
      liveFilter: prevState.liveFilter,
      hasTweetsFilter: !prevState.hasTweetsFilter 
    }
  ))

  render() {
    if (this.props.tournamentData.length === 0) {
      return (
        <div>
          There are no ongoing tournaments, please check back later.
        </div>
      )
    } else {
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
                  hasTweetsFilter={this.state.hasTweetsFilter}/>
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
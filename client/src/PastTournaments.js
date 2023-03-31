import React, { Fragment } from "react";
import { Accordion, Grid, Icon } from 'semantic-ui-react'
import { DateTime } from 'luxon';
import Games from "./Games";

//React component to display the past tournaments and their info
//TODO? display old scores and/or tweets
class PastTournaments extends React.Component {
  state = { activeArray: new Set()}

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

  render() {
    return (
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
                <Grid.Column mobile={10} tablet={5} computer={5}>
                  <Icon name='dropdown'/>
                  {tournament.name}
                </Grid.Column>
                <Grid.Column only='tablet computer' tablet={5} computer={5}>
                  {tournament.location}
                </Grid.Column>
                <Grid.Column only='tablet computer' tablet={3} computer={3}>
                  {tournament.division_name}
                </Grid.Column>
                <Grid.Column textAlign="right" mobile={6} tablet={3} computer={3}>
                  {startFormat} - {endFormat}
                </Grid.Column>
              </Grid>
            </Accordion.Title>
            <Accordion.Content active={this.state.activeArray.has(index)}>
              <Games gamesData={tournament.games} 
                    tweets={this.props.tweets} 
                    liveFilter={false} 
                    hasTweetsFilter={false}
                    starClick={false}
                    starredGames={new Set()}/>
            </Accordion.Content>
            </Fragment>
          )
        })}
      </Accordion>
    )
  }
}


export default PastTournaments;
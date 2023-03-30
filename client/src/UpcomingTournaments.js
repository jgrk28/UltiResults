import React, { Fragment } from "react";
import { Accordion, Grid } from 'semantic-ui-react'
import { DateTime } from 'luxon';

//React component to display the upcoming tournaments and their info
class UpcomingTournaments extends React.Component {
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
              active={true}
              style={{cursor: "default"}}
            >
              <Grid>
                <Grid.Column mobile={10} tablet={5} computer={5}>
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
            </Fragment>
          )
        })}
      </Accordion>
    )
  }
}


export default UpcomingTournaments;
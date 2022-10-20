import React, { Fragment } from "react";
import Games from "./Games";

//React component to display the current tournaments and their info
class CurrentTournaments extends React.Component {
  render() {
    const columnDescriptions = [
      { display: 'Name', key: 'name'},
      { display: 'Location', key: 'location'},
      { display: 'Start', key: 'start_date'},
      { display: 'End', key: 'end_date'}
    ]
    return (

      <table className="tournaments-table">
      <thead>
        <tr>
          {columnDescriptions.map((column) => {
            return <th key={column.key}>{column.display}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {this.props.tournamentData.map((tournament) => {
          return (
            <Fragment key={tournament.id}>
            <tr>
              {columnDescriptions.map((column) => {
                return <td key={column.key}>{tournament[column.key]}</td>
              })}
            </tr>
            <tr>
              <td>
                <Games gamesData={tournament.games} tweets={this.props.tweets} teamsMap={this.props.teamsMap}/>
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

export default CurrentTournaments;
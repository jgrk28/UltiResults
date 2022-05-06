import React from "react";

//React component to display the current tournaments and their info
//TODO make it possible to expand a tournament of interest
class CurrentTournaments extends React.Component {
  render() {
    return (
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Location</th>
      <th>Start</th>
      <th>End</th>
    </tr>
  </thead>
  <tbody>
  {this.props.tournamentData.map((row)=>{return (
    <tr key={row.id}>
      <td>{ row.name }</td>
      <td>{ row.location }</td>
      <td>{ row.start_date }</td>
      <td>{ row.end_date }</td>
    </tr>
  )})}
  </tbody>
</table>
    )
  }
}

export default CurrentTournaments;
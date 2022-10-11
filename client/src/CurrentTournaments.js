import React from "react";
import ExpandedTable from "./ExpandableTable";
import Test from "./Test";
import Tweet from "./Tweet";

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
      <ExpandedTable 
        rowItems={this.props.tournamentData} 
        columns={columnDescriptions} 
        expansion={<Tweet json={this.props.tweet}/>} 
      />
    )
  }
}

export default CurrentTournaments;
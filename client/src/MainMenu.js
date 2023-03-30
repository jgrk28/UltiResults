import React, { Fragment } from "react";
import { Menu } from 'semantic-ui-react'
import CurrentTournaments from "./CurrentTournaments";
import UpcomingTournaments from "./UpcomingTournaments";
import PastTournaments from "./PastTournaments";


export default class MainMenu extends React.Component {
  state = { activeItem: 'current' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    const currentBlock = activeItem === 'current' ? 
      <CurrentTournaments 
        tournamentData = {this.props.tournamentData.current}
        tweets = {this.props.newTweets}
      /> : null;
    const pastBlock = activeItem === 'past' ? 
      <PastTournaments 
        tournamentData = {this.props.tournamentData.past}
      /> : null;
    const upcomingBlock = activeItem === 'upcoming' ? 
      <UpcomingTournaments 
        tournamentData = {this.props.tournamentData.upcoming}
      /> : null;

    return (
      <Fragment>
      <Menu fluid widths={3}>
        <Menu.Item
          name='current'
          active={activeItem === 'current'}
          onClick={this.handleItemClick}
        >
        Current
        </Menu.Item>
        <Menu.Item
          name='past'
          active={activeItem === 'past'}
          onClick={this.handleItemClick}
        >
        Past
        </Menu.Item>

        <Menu.Item
          name='upcoming'
          active={activeItem === 'upcomingEvents'}
          onClick={this.handleItemClick}
        >
        Upcoming
        </Menu.Item>
      </Menu>
      {currentBlock}
      {pastBlock}
      {upcomingBlock}
      </Fragment>
    )
  }
}
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import socketIOClient from "socket.io-client";
import 'semantic-ui-css/semantic.min.css'
import { Container, Header } from 'semantic-ui-react'

import Navbar from "./Navbar";
import CurrentTournaments from "./CurrentTournaments";
import UpcomingTournaments from "./UpcomingTournaments";
import PastTournaments from "./PastTournaments";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tournamentData: [],
      dataLoaded: false,
      newTweets: [],
    };
  }

  streamTweets() {
    let port = process.env.REACT_APP_SERVER_LOCAL_PORT;
    let socket = socketIOClient(`:${port}/`, { transports: ['websocket'] });

    socket.on("connect", () => {
      console.log(`connected to server`);
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    
    socket.on("tweet", (json) => {
      console.log(json);
      if (json.data) {
        this.setState(prevState => ({
          newTweets: [...prevState.newTweets, json]
        }))
      }
    });
    socket.on("heartbeat", (data) => {
      console.log(data);
      //dispatch({ type: "update_waiting" });
    });
    socket.on("error", (data) => {
      console.log(data);
      //dispatch({ type: "show_error", payload: data });
    });
    socket.on("authError", (data) => {
      console.log("data =>", data);
      //dispatch({ type: "add_errors", payload: [data] });
    });
  };

  
  componentDidMount() {
    let port = process.env.REACT_APP_SERVER_LOCAL_PORT;
    fetch(`http://localhost:${port}/`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          tournamentData: json,
          dataLoaded: true,
          newTweets: [],
        });
    })

    this.streamTweets();
  }

  render() {
    if (!this.state.dataLoaded) {
      return (
        <Container>
          <Header as="h1" style={{paddingTop: "1em"}}>
            UltiResults
            <Header.Subheader>Powered by Live Tweets</Header.Subheader>
              Please wait for data
          </Header>
        </Container>
      );
    }
    return (
      <Container>
        <Header as="h1" style={{paddingTop: "1em"}}>
          UltiResults
          <Header.Subheader>Powered by Live Tweets</Header.Subheader>
        </Header>

        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element=
              {<CurrentTournaments 
                tournamentData = {this.state.tournamentData.current}
                tweets = {this.state.newTweets}
              />}
            />
            <Route path="/current" element=
              {<CurrentTournaments 
                tournamentData = {this.state.tournamentData.current}
                tweets = {this.state.newTweets}
              />}
            />
            <Route path="/upcoming" element=
              {<UpcomingTournaments tournamentData = {this.state.tournamentData.upcoming}  />}
            />
            <Route path="/past" element=
              {<PastTournaments tournamentData = {this.state.tournamentData.past}  />}
            />
          </Routes>
        </BrowserRouter>
      </Container>
    );
  }
}

export default App;
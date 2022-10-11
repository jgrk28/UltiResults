import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import socketIOClient from "socket.io-client";

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
    let socket;
    //TODO look into socket sending multiple connection requests
    if (process.env.NODE_ENV === "development") {
      socket = socketIOClient(
        "http://localhost:9000/", { transports: ['websocket'] }
      );
    } else {
      socket = socketIOClient("/", { transports: ['websocket'] });
    }

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
    fetch("http://localhost:9000/")
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
        <div className="ui container">
          <div className="introduction"></div>
  
          <h1 className="ui header">
            <div className="content">
              UltiResults
              <div className="sub header">Powered by Live Tweets</div>
              <p>
                Please wait for data
              </p>
            </div>
          </h1>
        </div>
      );
    }
    return (
      <div className="ui container">
        <div className="introduction"></div>

        <h1 className="ui header">
          <div className="content">
            UltiResults
            <div className="sub header">Powered by Live Tweets</div>
          </div>
        </h1>

        <div className="ui container">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element=
                {<CurrentTournaments 
                  tournamentData = {this.state.tournamentData.current} 
                  tweet = {this.state.newTweets[0]}
                />}
              />
              <Route path="/current" element=
                {<CurrentTournaments 
                  tournamentData = {this.state.tournamentData.current} 
                  tweet = {this.state.newTweets[0]}
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
        </div>
      </div>
    );
  }
}

export default App;
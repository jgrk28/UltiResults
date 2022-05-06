import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import CurrentTournaments from "./CurrentTournaments";
import UpcomingTournaments from "./UpcomingTournaments";
import PastTournaments from "./PastTournaments";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tournamentData: [],
      dataLoaded: false
    };
  }

  componentDidMount() {
    fetch("http://localhost:9000/")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          tournamentData: json,
          dataLoaded: true
        });
    })
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
                {<CurrentTournaments tournamentData = {this.state.tournamentData.current} />}
              />
              <Route path="/current" element=
                {<CurrentTournaments tournamentData = {this.state.tournamentData.current} />}
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
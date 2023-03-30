import React from "react";
import { io } from "socket.io-client";
import 'semantic-ui-css/semantic.min.css'
import { Container, Header } from 'semantic-ui-react'


import MainMenu from "./MainMenu";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tournamentData: [],
      dataLoaded: false,
      newTweets: [],
    };
  }

  startStream() {
    let port = process.env.REACT_APP_SERVER_LOCAL_PORT;
    let socket = io(`:${port}`);

    socket.on("connect", () => {
      console.log(`connected to server`);
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on("init", (json) => {
      console.log(`data initialized`);
      this.setState({
        tournamentData: json,
        dataLoaded: true,
        newTweets: [],
      });
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
    this.startStream();
  }

  render() {
    if (!this.state.dataLoaded) {
      return (
        <Container>
          <Header as="h1" style={{paddingTop: "1em"}}>
            Frisbee Results
            <Header.Subheader>Powered by Live Tweets</Header.Subheader>
              Please wait for data
          </Header>
        </Container>
      );
    }
    return (
      <Container>
        <Header as="h1" style={{paddingTop: "1em"}}>
          Frisbee Results
          <Header.Subheader>Powered by Live Tweets</Header.Subheader>
        </Header>

        <MainMenu
          tournamentData = {this.state.tournamentData}
          tweets = {this.state.newTweets}
        />

      </Container>
    );
  }
}

export default App;
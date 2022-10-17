import React from "react";
import TweetRow from "./TweetRow";

//This component displays all tweets it is given into one stream
const TweetStream = ({ tweets }) => {
    return (
        <table className="tweet-stream">
            <tbody>
                {tweets.map((tweet) => (
                <TweetRow key={tweet.data.id} tweet={tweet}/>
                ))}
            </tbody>
        </table>
        );
};

export default TweetStream;
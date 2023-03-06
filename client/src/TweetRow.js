import React from "react";

const TweetRow = ({ tweet }) => {
	return (
	<tr>
		<td><b>@{tweet.twitter}: </b>{tweet.tweet}</td>
	</tr>
	);
};

export default TweetRow;
                
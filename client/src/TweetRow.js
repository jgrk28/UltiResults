import React from "react";

const TweetRow = (props) => {
	return (
	<tr>
		<td>{props.tweet.data.text}</td>
	</tr>
	);
};

export default TweetRow;
                
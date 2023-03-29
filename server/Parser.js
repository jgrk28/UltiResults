class Score { 
    constructor(team1Score, team2Score) {
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }
}

// Static class that contains functions for NLP parsing of tweets
class Parser {
    //TODO give this state so that is created for each game and can keep track of more things and make better guesses
    
    //Returns a Score object based on the tweet given
    static parseScore(tweet, isTeam1First) {
        //Matches any of the following formats 1-1, 1 - 1, 1 1 with any 1 or two digit number
        const score = tweet.match(/\d{1,2} *- *\d{1,2}/);
        if (score === null) {
            return null;
        }
        const splitScore = score[0].split('-');
        //Assume our scrore comes first
        if (isTeam1First) {
            return new Score(splitScore[0].trim(), splitScore[1].trim());
        } else {
            return new Score(splitScore[1].trim(), splitScore[0].trim());
        }
        
    }
}

module.exports = Parser;
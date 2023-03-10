var express = require('express');
const { DateTime } = require('luxon');
var router = express.Router();

const pool = require('../database');

/* GET home page. */
router.get('/', async (req, res, next) => {
  //Use env variables in launch.json to connect to db
  const client = await pool.connect();

  //Get current, past, and upcoming tournaments
  const currentDate = DateTime.now().setZone("America/New_York");
  //const currentDate = DateTime.utc(2023, 3, 4).toSQLDate();
  console.log(currentDate);
  const currentQueryString = 
    `SELECT 
    tournaments.*, division.division_name 
    FROM tournaments JOIN division ON tournaments.division_id=division.id
    WHERE start_date <= '${currentDate}' AND 
    end_date >= '${currentDate}' AND 
    do_stream = TRUE`
  const upcomingQueryString = 
    `SELECT tournaments.*, division.division_name FROM tournaments 
    JOIN division ON tournaments.division_id=division.id 
    WHERE start_date > '${currentDate}'`
  const pastQueryString = 
    `SELECT tournaments.*, division.division_name FROM tournaments 
    JOIN division ON tournaments.division_id=division.id 
    WHERE end_date < '${currentDate}'`

  const currentTournamentsQuery = await client.query(currentQueryString);
  const upcomingTournamentsQuery = await client.query(upcomingQueryString);
  const pastTournamentsQuery = await client.query(pastQueryString);
  
  var currentTournaments = currentTournamentsQuery.rows;
  const upcomingTournaments = upcomingTournamentsQuery.rows;
  const pastTournaments = pastTournamentsQuery.rows;

  for (tournamentList of [currentTournaments, pastTournaments])
    //Get games for current and past tournaments
    for (var i = 0; i < tournamentList.length; i++) {
      const tournament = tournamentList[i];
      const gamesQueryString = 
        `SELECT 
          games.id, 
          tournament_id, 
          team1_id, 
          t1.usau_name as team1_name, 
          t1.twitter as team1_twitter,
          team2_id,
          t2.usau_name as team2_name,
          t2.twitter as team2_twitter,
          to_char (start_time at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as start_time
        FROM games 
        JOIN teams t1 on games.team1_id = t1.id 
        JOIN teams t2 on games.team2_id = t2.id
        WHERE tournament_id = ${tournament.id} ORDER BY start_time`
      const gamesQuery = await client.query(gamesQueryString);
      var games = gamesQuery.rows;
      //Insert tweets into current tournaments json
      for (var j = 0; j < games.length; j++) {
        const game = games[j];
        const gameTime = DateTime.fromISO(game.start_time, {zone: 'utc'});
        //TODO better solution for game end time
        const gameEnd = gameTime.plus({hours: 1, minutes: 30});
        const tweetsQueryString = 
          `SELECT tweets.id,team_id,time,tweet,twitter FROM tweets
          JOIN teams ON team_id = teams.id 
          WHERE time > '${gameTime.toSQL()}' AND
          time < '${gameEnd.toSQL()}' AND
          (team_id = ${game.team1_id} OR 
          team_id = ${game.team2_id})
          ORDER BY time DESC`;
        const tweetsQuery = await client.query(tweetsQueryString);
        const tweets = tweetsQuery.rows;
        games[j].tweets = tweets;
      }
      //Insert games into current tournaments json
      tournamentList[i].games = games;
    }

  //Create map of team ids to names to let pug display names
  const teamsQueryString = `SELECT * FROM teams`
  const teamsQuery = await client.query(teamsQueryString);
  const teams = teamsQuery.rows;

  res.json({
    current: currentTournaments,
    upcoming: upcomingTournaments,
    past: pastTournaments,
    })

  await client.release();
});

module.exports = router;

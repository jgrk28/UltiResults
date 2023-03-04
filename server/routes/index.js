var express = require('express');
const { DateTime } = require('luxon');
var router = express.Router();

const pool = require('../database');

/* GET home page. */
router.get('/', async (req, res, next) => {
  //Use env variables in launch.json to connect to db
  const client = await pool.connect();

  //Get current, past, and upcoming tournaments
  const currentDate = DateTime.now().toSQLDate();
  //const currentDate = DateTime.utc(2023, 3, 4, 14);
  const currentQueryString = `SELECT * FROM tournaments WHERE 
                              start_date <= '${currentDate}' AND 
                              end_date >= '${currentDate}' AND 
                              do_stream = TRUE`
  const upcomingQueryString = `SELECT * FROM tournaments WHERE start_date > '${currentDate}'`
  const pastQueryString = `SELECT * FROM tournaments WHERE end_date < '${currentDate}'`

  const currentTournamentsQuery = await client.query(currentQueryString);
  const upcomingTournamentsQuery = await client.query(upcomingQueryString);
  const pastTournamentsQuery = await client.query(pastQueryString);
  
  var currentTournaments = currentTournamentsQuery.rows;
  const upcomingTournaments = upcomingTournamentsQuery.rows;
  const pastTournaments = pastTournamentsQuery.rows;

  //Get games for current tournaments
  for (var i = 0; i < currentTournaments.length; i++) {
    const tournament = currentTournaments[i];
    const gamesQueryString = `SELECT * FROM games WHERE tournament_id = ${tournament.id} ORDER BY start_time`
    const gamesQuery = await client.query(gamesQueryString);
    var games = gamesQuery.rows;
    //Insert tweets into current tournaments json
    for (var j = 0; j < games.length; j++) {
      const game = games[j];
      const tweetsQueryString = `SELECT * FROM tweets WHERE team_id = ${game.team1_id} OR team_id = ${game.team2_id} ORDER BY time`
      const tweetsQuery = await client.query(tweetsQueryString);
      const tweets = tweetsQuery.rows;
      games[j].tweets = tweets;
    }
    //Insert games into current tournaments json
    currentTournaments[i].games = games;
  }

  //Create map of team ids to names to let pug display names
  const teamsQueryString = `SELECT * FROM teams`
  const teamsQuery = await client.query(teamsQueryString);
  const teams = teamsQuery.rows;
  const teamsMap = new Map();
  for (const team of teams) {
    teamsMap.set(team.id, {usau_name: team.usau_name, twitter: team.twitter});
  }

  res.json({
    current: currentTournaments,
    upcoming: upcomingTournaments,
    past: pastTournaments, 
    teams: Object.fromEntries(teamsMap)
    })

  await client.release();
});

module.exports = router;

var express = require('express');
const { DateTime } = require('luxon');
var router = express.Router();

const { Client } = require('pg');
const database = new Client()

/* GET home page. */
router.get('/', async (req, res, next) => {
  //Use env variables in launch.json to connect to db
  await database.connect()

  //Get current, past, and upcoming tournaments
  //TODO reformat date from database
  const currentDate = DateTime.local(2022,5,6).toSQLDate();
  const currentQueryString = `SELECT * FROM tournaments WHERE 
start_date <= '${currentDate}' AND end_date >= '${currentDate}'`
  const upcomingQueryString = `SELECT * FROM tournaments WHERE start_date > '${currentDate}'`
  const pastQueryString = `SELECT * FROM tournaments WHERE end_date < '${currentDate}'`

  const currentTournamentsQuery = await database.query(currentQueryString);
  const upcomingTournamentsQuery = await database.query(upcomingQueryString);
  const pastTournamentsQuery = await database.query(pastQueryString);
  
  var currentTournaments = currentTournamentsQuery.rows;
  const upcomingTournaments = upcomingTournamentsQuery.rows;
  const pastTournaments = pastTournamentsQuery.rows;

  //Get games for current tournaments
  for (var i = 0; i < currentTournaments.length; i++) {
    const tournament = currentTournaments[i];
    const gamesQueryString = `SELECT * FROM games WHERE tournament_id = ${tournament.id} ORDER BY start_time`
    const gamesQuery = await database.query(gamesQueryString);
    const games = gamesQuery.rows;
    //Insert games into current tournaments json
    currentTournaments[i].games = games;
  }

  //Create map of team ids to names to let pug display names
  const teamsQueryString = `SELECT * FROM teams`
  const teamsQuery = await database.query(teamsQueryString);
  const teams = teamsQuery.rows;
  const teamsMap = new Map();
  for (const team of teams) {
    teamsMap.set(team.id, team.usau_name);
  }

  res.json({
    current: currentTournaments,
    upcoming: upcomingTournaments,
    past: pastTournaments, 
    teams: teamsMap
    })

  await database.end()
});

module.exports = router;

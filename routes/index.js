var express = require('express');
var router = express.Router();

const { Client } = require('pg')
const client = new Client()

/* GET home page. */
router.get('/', async (req, res, next) => {
  //Use env variables in launch.json to connect to db
  await client.connect()

  //Get current, past, and upcoming tournaments
  //TODO reformat date from database
  const currentDate = new Date().toISOString().slice(0, 10);
  const currentQueryString = `SELECT * FROM tournaments WHERE 
start_date <= '${currentDate}' AND end_date >= '${currentDate}'`
  const upcomingQueryString = `SELECT * FROM tournaments WHERE start_date > '${currentDate}'`
  const pastQueryString = `SELECT * FROM tournaments WHERE end_date < '${currentDate}'`
  const currentTournamentsQuery = await client.query(currentQueryString);
  const upcomingTournamentsQuery = await client.query(upcomingQueryString);
  const pastTournamentsQuery = await client.query(pastQueryString);
  const currentTournaments = currentTournamentsQuery.rows;
  const upcomingTournaments = upcomingTournamentsQuery.rows;
  const pastTournaments = pastTournamentsQuery.rows;

  //Render index page passing in the data from the database
  res.render('index', { title: 'UltiResults', currentTournaments, upcomingTournaments, pastTournaments});
  await client.end()
});

module.exports = router;

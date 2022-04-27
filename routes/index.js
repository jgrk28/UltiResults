var express = require('express');
var router = express.Router();

const { Client } = require('pg')
const client = new Client()

/* GET home page. */
router.get('/', async (req, res, next) => {
  //Use env variables in launch.json to connect to db
  await client.connect()
  const data = await client.query('SELECT * FROM teams')
  var teams = data.rows
  res.render('index', { title: 'UltiResults', teams});
  await client.end()
});

module.exports = router;

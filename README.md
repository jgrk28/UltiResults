# ultiResults
### Purpose
Webapp to display live tweeted results for ultimate frisbee tournaments.

As ultimate frisbee is a relatively small sport, there are often no official live scores reported.
Instead fans rely on following different teams live tweets to get updates about ongoing tournaments.
The goal of this webapp is to compile and organize the live tweets of all the teams that are playing to constuct a live scorecard.

### Technology
The webapp server side is built with Postgres, NodeJS, Express.
Currently the frontend just consists of the Pug template engine.
The webapp scrapes data from https://usaultimate.org/ to get the schedule of tournaments and games.
Then uses the twitter API to stream the tweets from the currently playing teams.

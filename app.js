const express = require("express");
const app = express();
const configRoutes = require('./routes');
app.use(express.json());

const static = express.static(__dirname + '/public');

app.use('/public', static);
const { engine } = require('express-handlebars');
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);
app.listen(3000, () => {
    console.log('Server: http://localhost:3000');
});

// const seed = require('./data/seed/movie');
// const addMovie = seed.addMovie;
// addMovie();

// const seedrandom = require('seedrandom')
// const { customRandom, urlAlphabet } = require('nanoid');
// const rng = seedrandom("AAMC 34th Street 14");
// const nanoid = customRandom(urlAlphabet, 7, size => {
//     return (new Uint8Array(size)).map(() => 256 * rng())})
// console.log(nanoid())

// console.log(new Date())
// const dt = new Date;
// console.log(dt.toLocaleString('en-US', { timeZone: 'America/New_York' }))

// const seed = require('./data/seed/theater');
// const addTheater = seed.addTheater;
// addTheater();

// const seed = require('./data/seed/showtimes');
// const createMovieShowTime = seed.createMovieShowTime;
// createMovieShowTime("meJSzVD");

// const seed = require('./data/seed/showtimes');
// const addTheaterForMovie = seed.addTheaterForMovie;
// addTheaterForMovie('meJSzVD', 'H5dsl-5');

// const seed = require('./data/seed/showtimes');
// const addScreens = seed.addScreens;
// addScreens('meJSzVD', 'H5dsl-5', 1);

const seed = require('./data/seed/showtimes');
const addToSmallScreen = seed.addToSmallScreen;
addToSmallScreen('meJSzVD', 'H5dsl-5', 1);
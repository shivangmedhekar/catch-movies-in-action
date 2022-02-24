const express = require('express');
const router = express.Router();

const movieData = require('./../data/movies');
const usersData = require('./../data/users');
const showtimeData = require('./../data/showtimes');

router.get('/', async (req, res) => {

    // Gets Latest Releases, Now Playing and Upcoming Movies
    try {

        await showtimeData.clearOldShowtime(); // Deletes old showtime data from database

        const [nowPlayingMovies, latestReleases] = await movieData.getMovies(15, 'now-playing', true);
        const upcomingMovies = await movieData.getMovies(15, 'coming-soon', false);

        res.status(200).render('pages/home/home.handlebars', {
            nowPlayingMovies: JSON.stringify(nowPlayingMovies), upcomingMovies: JSON.stringify(upcomingMovies),
            latestReleases: JSON.stringify(latestReleases)});

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.get('/nowplaying', async (req, res) => {

    // Gets all Now Playing Movies
    try {
        const nowPlayingMovies = await movieData.getMovies(30, 'now-playing', false);

        res.status(200).render('pages/home/nowplaying.handlebars',
            {nowPlayingMovies: JSON.stringify(nowPlayingMovies)})

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.get('/upcoming', async (req, res) => {

    // Gets all Upcoming Movies
    try {
        const upcomingMovies = await movieData.getMovies(30, 'coming-soon', false);

        res.status(200).render('pages/home/upcoming.handlebars',
            {upcomingMovies: JSON.stringify(upcomingMovies)})

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

module.exports = router;
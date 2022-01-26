const express = require('express');
const router = express.Router();

const movieData = require('./../data/movies');

router.get('/', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {
        const [nowPlayingMovies, latestReleases] = await movieData.getNowPlayingMovies(15);
        const upcomingMovies = await movieData.getUpcomingMovies(15);

        res.status(200).render('pages/home/home.handlebars', {
            nowPlayingMovies: JSON.stringify(nowPlayingMovies), upcomingMovies: JSON.stringify(upcomingMovies),
            latestReleases: JSON.stringify(latestReleases)});

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.get('/nowplaying', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {
        const [nowPlayingMovies, latestReleases] = await movieData.getNowPlayingMovies(30);

        res.status(200).render('pages/home/nowplaying.handlebars',
            {nowPlayingMovies: JSON.stringify(nowPlayingMovies)})

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.get('/upcoming', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {
        const upcomingMovies = await movieData.getUpcomingMovies(30);

        res.status(200).render('pages/home/upcoming.handlebars',
            {upcomingMovies: JSON.stringify(upcomingMovies)})

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});
module.exports = router;
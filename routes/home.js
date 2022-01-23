const express = require('express');
const router = express.Router();

const movieData = require('./../data/movies');

router.get('/', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {

        const nowPlayingMovies = await movieData.getNowPlayingMovies();

        res.status(200).render('pages/home/home.handlebars', {movies: nowPlayingMovies});

    }catch (e) {
        res.status(503).render('pages/error/error')
    }
});

module.exports = router;
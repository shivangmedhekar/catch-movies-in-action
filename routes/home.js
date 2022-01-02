const express = require('express');
const router = express.Router();
const movieData = require('./../data/movies');



router.get('/', async (req, res) => {

    const movieList = await movieData.getAllMovies();
    res.render('pages/home/home', {movies: movieList});
});

module.exports = router;
const express = require('express');
const router = express.Router();
const data = require('../data/movies');
const showtimeData = require('../data/showtimes')

router.get('/:movieId', async (req, res) => {

    //Error handling of movieId, string, size=10
    try {
        /*------------ Error Handling Start ------------*/
        if (Object.keys(req.params).length === 0) throw "Error: movieId not passed";

        const movieId = req.params.movieId;

        if (typeof movieId !== 'string') throw 'Error: movieId not of type string';
        /*------------ Error Handling End ------------*/

        const movie = await data.getMovieBySlug(movieId);
        if (movie === null) throw 'Error: movie not found';

        res.render('pages/movie/movie', {movie: movie});
    }
    catch (e){

    }
});

router.get('/:slug/showtimes', async (req, res) => {

    res.render('pages/showtimes/showtimes', { slug: req.params.slug });
});

router.get('/:slug/showtimes/:showtimeId', async (req, res) => {
    const showDetails = await showtimeData.getShowsDetails(req.params.showtimeId);
    res.render('pages/theater/seating', {showDetails: JSON.stringify(showDetails)});
});

router.get('/getMovieBySlug/:slug', async (req, res) => {

    const movie = await data.getMovieBySlug(req.params.slug);
    res.json({movie: movie});
});

router.get('/getTopMovies/ajaxCall', async (req, res) => {

    const movies = await data.getTopMovies();
    res.json({movies: movies});
});

router.get('/getMovieBySlug/ajaxCall', async (req, res) => {

    const movies = await data.getTopMovies();
    res.json({movies: movies});
});


module.exports = router;
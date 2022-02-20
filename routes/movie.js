const express = require('express');
const router = express.Router();

const movieData = require('../data/movies');
const showtimeData = require('../data/showtimes')

router.get('/:slug', async (req, res) => {

    try {
        /*------------ Error Handling Start ------------*/
        if (Object.keys(req.params).length === 0) throw "Error: slug not passed";

        const slug = req.params.slug;

        if (typeof slug !== 'string') throw 'Error: slug not of type string';
        /*------------ Error Handling End ------------*/

        const movie = await movieData.getMovieBySlug(slug);
        if (!movie) throw 'Error: movie not found';

        res.status(200).render('pages/movie/movie', {movie: JSON.stringify(movie) });
    }

    catch (e){
        console.log(e);
        if (e === "Error: slug not passed" || e === "Error: slug not of type string")
            res.status(400).render('pages/error/error', {'error': 'Error 400: Bad Request'});

        else res.status(404).render('pages/error/error', {'error': 'Error 404: Not Found'});
    }
});

router.post('/:movieId', async (req, res) => {

    try{

        const movie = await movieData.getMovieById(req.params.movieId);
        res.json(movie);
        
    }catch (e) {
        
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

    const movie = await movieData.getMovieBySlug(req.params.slug);
    res.json({movie: movie});
});

// router.get('/getTopMovies/ajaxCall', async (req, res) => {
//
//     const movies = await movieData.getTopMovies();
//     res.json({movies: movies});
// });

router.get('/getMovieBySlug/ajaxCall', async (req, res) => {

    const movies = await movieData.getTopMovies();
    res.json({movies: movies});
});


module.exports = router;
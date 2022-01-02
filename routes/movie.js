const express = require('express');
const router = express.Router();
const data = require('../data/movies');

router.get('/:movieId', async (req, res) => {

    //Error handling of movieId, string, size=10, only alpha num
    try {
        const movie = await data.getMovieById(req.params.movieId);
        res.render('pages/movie/movie', {movie: movie});
    }
    catch (e){

    }

});

module.exports = router;
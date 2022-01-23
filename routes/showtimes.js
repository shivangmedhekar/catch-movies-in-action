const express = require('express');
const router = express.Router();

const data = require('./../data/showtimes');


router.get('/:movieId', async (req, res) => {

    const shows = await data.getShowsOfMovie(req.params.movieId);

    const showsStringify = JSON.stringify(shows);

    res.render('pages/showtimes/showtimes', {shows: showsStringify});
});

router.post('/getshows/:theaterId/:slug/:searchDate', async (req, res) => {

    try {
        const shows = await data.getShowsOfMovie(req.params.theaterId, req.params.slug, req.params.searchDate);
        res.json(shows);
    }
    catch (e){
        res.json({error: 'No Shows Found'})
    }
});

module.exports = router;
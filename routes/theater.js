const express = require('express');
const router = express.Router();
const data = require('../data/theater');

router.get('/getTheaterNameById/:theaterId', async (req, res) => {



    const theaterName = await data.getTheaterNameById(req.params.theaterId);
    res.json({theaterName: theaterName});
});

router.get('/getAllTheaters/', async (req, res) => {

    const theaters = await data.getAllTheaters();
    res.json({theaters: theaters});
});

router.get('/getTheaterById/:theaterId', async (req, res) => {

    const theater = await data.getTheaterById(req.params.theaterId);
    res.json(theater);
});

module.exports = router;
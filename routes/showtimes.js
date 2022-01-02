const express = require('express');
const router = express.Router();

router.get('/:movieId', async (req, res) => {


    res.render('pages/showtimes/showtimes');
});

module.exports = router;
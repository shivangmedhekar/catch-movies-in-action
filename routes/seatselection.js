const express = require('express');
const router = express.Router();
const data = require('../data/seatselection');

router.get('/:format', async (req, res) => {

    const layout = await data.getAudiLayout(req.params.format);
    res.json({layout: layout});
});

module.exports = router;
const express = require('express');
const data = require("../data/checkout");
const router = express.Router();

router.post('/confirm-purchase', async (req, res) => {


    try {
        const orderSummary = JSON.parse(req.body['Purchase Summary']);

        res.render('pages/checkout/confirm-purchase', {orderSummary: JSON.stringify(orderSummary)})
    }
    catch (e){

    }
});

router.post('/checkout', async (req, res) => {

    //Error handling of movieId, string, size=10
    try {
        const showtime = await data.checkout(JSON.parse(req.body['orderSummary']));
        res.json(req.body)
    }
    catch (e){

    }
});

router.post('/order-summary', async (req, res) => {


    try {

    }
    catch (e){

    }
});

module.exports = router;
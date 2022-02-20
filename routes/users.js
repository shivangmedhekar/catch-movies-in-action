const express = require('express');
const router = express.Router();
const data = require('../data/users');

router.get('/', async (req, res) => {
    try{
        if (! req.session.user) throw 'Error: You should be logged in to acess this page';
        const orderHistory = await data.getOrderHistory(req.session.user.userId);
        res.render('pages/users/user', {user: req.session.user, orderHistory: JSON.stringify(orderHistory)});
    }catch (e){

    }
});





module.exports = router;
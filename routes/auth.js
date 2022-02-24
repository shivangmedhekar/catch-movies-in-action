const express = require('express');
const router = express.Router();

const usersData = require('./../data/users');

router.post('/signup', async (req, res) => {

    try {
        const { firstName, lastName, email, phoneNo, dob, password, confirmPassword } = req.body;

        const signUpInfo = await usersData.createUser(firstName, lastName, email, phoneNo, dob, password, confirmPassword);

        if (signUpInfo.userInserted) res.status(200).json(signUpInfo.user);

    }catch (e) {
        res.status(400).json({'error': e});
    }

});

router.get('/logout', async (req, res) => {

    if (req.session.user){
        req.session.destroy();
        res.status(200).json({'Logged Out': "Successfully"});
    }
    else {
        res.status(204).json();
    }

});

router.get('/auth-status', async (req, res) => {

    if(req.session.user) return res.json({ 'authStatus': true});
    else return res.json({ 'authStatus': false});
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const loginInfo = await usersData.checkUser(email, password);

        if (loginInfo.authenticated) {
            req.session.user = {
                userId: loginInfo.user._id,
                email: loginInfo.user.email,
                firstName: loginInfo.user.firstName,
                lastName: loginInfo.user.lastName
            }
            res.status(200).json(loginInfo.user);
        }
    }catch (e) {
        res.status(400).json({'error': e});
    }
});
module.exports = router;
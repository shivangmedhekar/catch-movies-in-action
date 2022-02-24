const express = require('express');
const router = express.Router();

const usersData = require('./../data/users');

router.post('/signup', async (req, res) => {

    try {

        if (Object.keys(req.body).length < 7) throw 'Error: Less data passed then required';

        const [firstName, lastName, email, phoneNo, dob, password, confirmPassword] = [req.body.firstName,
        req.body.lastName, req.body.email, req.body.phoneNo, req.body.dob, req.body.password, req.body.confirmPassword];

        /*------------ Error Handling Start ------------*/
        if (!firstName || !lastName || !email || !phoneNo || !dob || !password || !confirmPassword) throw 'Error: All fields are required';

        if (!firstName.trim().length) throw 'Error: first name empty';
        if (!lastName.trim().length) throw 'Error: last name empty';
        if (!email.trim().length) throw 'Error: email empty';
        if (!phoneNo.trim().length) throw 'Error: phone No empty';
        if (!dob.trim().length) throw 'Error: dob empty';
        if (!password.trim().length) throw 'Error: password empty';
        if (!confirmPassword.trim().length) throw 'Error: confirm password empty';

        if (typeof firstName !== 'string') throw 'Error: firstName should be of type String';
        if (typeof lastName !== 'string') throw 'Error: lastName should be of type String';
        if (typeof email !== 'string') throw 'Error: email should be of type String';
        if (typeof phoneNo !== 'string') throw 'Error: phoneNo should be of type String';
        if (typeof dob !== 'string') throw 'Error: dob should be of type String';
        if (typeof password !== 'string') throw 'Error: password should be of type String';
        if (typeof confirmPassword !== 'string') throw 'Error: confirmPassword should be of type String';

        if(!(firstName.match(/^[a-zA-Z]+$/))) throw 'Error: Invalid first name, only alphabets allowed';
        if(!(lastName.match(/^[a-zA-Z]+$/))) throw 'Error: Invalid last name, only alphabets allowed';
        if (!usersData.ValidateEmail(email)) throw 'Error: Invalid email';
        if (!phoneNo.match(/^\d{10}$/)) throw 'Error: Invalid phone number';

        if (!Date.parse(dob)) throw 'Error: Invalid Date of Birth';

        const todaysDate = new Date();
        if (new Date(dob) - todaysDate > 0) throw 'Error: Invalid Date of Birth';

        if (password !== confirmPassword) throw 'Error: password and confirm password do not match';

        /*------------ Error Handling End ------------*/

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

        if (Object.keys(req.body).length < 2) throw 'Error: Less data passed then required';

        const [email, password] = [req.body.email, req.body.password];

        /*------------ Error Handling Start ------------*/

        if (!email || !password ) throw 'Error: email or password not provided';

        if (!email.trim().length) throw 'Error: email empty';
        if (!password.trim().length) throw 'Error: password empty';

        if (typeof email !== 'string') throw 'Error: email should be of type String';
        if (typeof password !== 'string') throw 'Error: password should be of type String';

        if (!usersData.ValidateEmail(email)) throw 'Error: Invalid email';

        /*------------ Error Handling End -------------*/
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
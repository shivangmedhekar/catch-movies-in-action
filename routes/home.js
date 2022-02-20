const express = require('express');
const router = express.Router();

const movieData = require('./../data/movies');
const usersData = require('./../data/users');
const showtimeData = require('./../data/showtimes');

router.get('/', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {
        await showtimeData.clearOldShowtime();
        const [nowPlayingMovies, latestReleases] = await movieData.getMovies(15, 'now-playing', true);
        const upcomingMovies = await movieData.getMovies(15, 'coming-soon', false);

        res.status(200).render('pages/home/home.handlebars', {
            nowPlayingMovies: JSON.stringify(nowPlayingMovies), upcomingMovies: JSON.stringify(upcomingMovies),
            latestReleases: JSON.stringify(latestReleases)});

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.get('/nowplaying', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {
        const nowPlayingMovies = await movieData.getMovies(30, 'now-playing', false);

        res.status(200).render('pages/home/nowplaying.handlebars',
            {nowPlayingMovies: JSON.stringify(nowPlayingMovies)})

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.get('/upcoming', async (req, res) => {

    // Upcoming Movies and Top Rated Movies
    try {
        const upcomingMovies = await movieData.getMovies(30, 'coming-soon', false);

        res.status(200).render('pages/home/upcoming.handlebars',
            {upcomingMovies: JSON.stringify(upcomingMovies)})

    }catch (e) {
        console.log(e)
        res.status(503).render('pages/error/error', {error: "Error 503: Internal Server Error"})
    }
});

router.post('/signup', async (req, res) => {

    try {
        const { firstName, lastName, email, phoneNo, dob, password, confirmPassword } = req.body;


        const signUpInfo = await usersData.createUser( firstName, lastName, email, phoneNo, dob, password, confirmPassword );

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

// router.get('/profile', async (req, res) => {
//
//     try{
//         if (! req.session.user) throw 'Error: You should be logged in to acess this page';
//
//         res.render('pages/users/user', {user: req.session.user})
//     }catch (e){
//
//     }
// });

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
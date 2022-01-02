const homeRoutes = require('./home');
const movieRoutes = require('./movie');
const theaterRoutes = require('./theater');
const showtimesRoutes = require('./showtimes');

const constructorMethod = (app) => {

    app.use('/', homeRoutes);
    app.use('/movie', movieRoutes);
    app.use('/showtimes', showtimesRoutes);
    app.use('/seatselection', theaterRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};



module.exports = constructorMethod;
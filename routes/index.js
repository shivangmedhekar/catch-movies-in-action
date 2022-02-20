const homeRoutes = require('./home');
const movieRoutes = require('./movie');
const seatSelectionRoutes = require('./seatselection');
const showtimesRoutes = require('./showtimes');
const theaterRoutes = require('./theater');
const checkoutRoutes = require('./checkout');
const userRoutes = require('./users');

const constructorMethod = (app) => {

    app.use('/', homeRoutes);
    app.use('/profile', userRoutes);
    app.use('/movie', movieRoutes);
    app.use('/showtimes', showtimesRoutes);
    app.use('/seatselection', seatSelectionRoutes);
    app.use('/theater', theaterRoutes);
    app.use('/order', checkoutRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};



module.exports = constructorMethod;
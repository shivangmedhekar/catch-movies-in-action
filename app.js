const express = require("express");
require('dotenv').config();
const app = express();
const configRoutes = require('./routes');
app.use(express.json());
const session = require('express-session');

app.use(
    session({
        name: 'CMA',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 3600000*24 }
    })
);

app.get('/profile', (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).render('pages/error/error', {error: "You need to be logged in"});
    } else {
        next();
    }
});

const static = express.static(__dirname + '/public');

app.use('/public', static);
const { engine } = require('express-handlebars');
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);
app.listen(3000, () => {
    console.log('Server: http://localhost:3000');
});

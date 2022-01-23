const express = require("express");
require('dotenv').config();
const app = express();
const configRoutes = require('./routes');
app.use(express.json());

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

const pug = require('pug');
const express = require('express');
const mysql = require('mysql');
const dbconfig = require('./config/database');
const connection = mysql.createConnection(dbconfig.connection);
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

require('./config/passport')(passport);

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));

app.set('view engine', 'pug');

app.use(session({
    secret: 'thereisnosecret',
    resave: true,
    saveUninitialized: true
 } )); 
app.use(passport.initialize());
app.use(passport.session()); 

require('./route/route')(app, passport);
// require('./config/change')(app);

app.use(flash()); 

app.listen(8000, ()=>{console.log('Connected')})
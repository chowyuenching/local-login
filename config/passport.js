const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const dbconfig = require('./database');
const connection = mysql.createConnection(dbconfig.connection);
const bodyParser = require('body-parser');


connection.query('USE ' + dbconfig.connection.database);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        connection.query(`SELECT * FROM users WHERE id = ${id} `, function(err, rows){
            done(err, rows[0]);
        });
    });


    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) {
            connection.query(`SELECT * FROM users WHERE name = '${username}'`, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, null);
                } else {

                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null),
                        email: req.body.email
                    };
                    
                    var insertQuery = `INSERT INTO users (id, name, password, age, email ) values (NULL,?,?,NULL,?)`;

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.email],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) {
            connection.query(`SELECT * FROM users WHERE name = '${username}'`, function(err, rows){
                // console.log('nothin here', bcrypt.compareSync(password, rows[0].password))
                if (err){
                    return done(err);
                }

                if (!rows.length) {
                    console.log('2nd error')
                    return done(null, false, null); 
                }

                if (!bcrypt.compareSync(password, rows[0].password)){
                    return done(null, false, null);
                }

                if(bcrypt.compareSync(password, rows[0].password)){
                    return done(null, rows[0]);
                }
                    
            });
        })
    );
};
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const dbconfig = require('../config/database');
const connection = mysql.createConnection(dbconfig.connection); 
var change = require('../config/change');

module.exports = (app,passport)=>{

    app.get('/',ensureLoggedIn,function(req,res){
        var row = [];
        var row2=[];
        var user_id = req.user.id
        connection.query(`select * from users where id = ${user_id}`, function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) { 
                        row[i] = rows[i];
                        
                    }  
                }
                console.log(row);
                
            }

            res.redirect('/main')
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', { });
    });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/login'//,
            // failureFlash : true 
    }));

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/main', 
            failureRedirect : '/login'//,
            // failureFlash : true 
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.render('main', {});
    });

    app.get('/main', ensureLoggedIn,(req,res)=>{
        let id = req.user.id;
        let name = req.user.name;
        let email = req.user.email;
        res.render('main', {id:id, name: name, email: email});
    })

    app.get('/setting', ensureLoggedIn, (req,res)=>{
        let id = req.user.id;
        let name = req.user.name;
        let email = req.user.email;
        res.render('content2', {id:id, name: name, email: email})
    })

    app.post('/savesetting', ensureLoggedIn, (req,res)=>{
        let id = req.user.id;
        let new_name = req.body.username;
        let new_password = req.body.password;
        let new_email = req.body.email;
        change.save_setting(id, new_name, new_password, new_email);
        res.redirect('/setting');
    })

    app.get('/error', (req,res)=>{
        res.render('error', {})
    })

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


};

function ensureLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/login');
}
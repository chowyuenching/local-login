const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const dbconfig = require('./database');
const connection = mysql.createConnection(dbconfig.connection);
const bodyParser = require('body-parser');

connection.query('USE ' + dbconfig.connection.database);

module.exports = {
    save_setting: (id, name, password, email)=>{
        let hashed_password = bcrypt.hashSync(password, null, null)
        connection.query(`UPDATE users SET name='${name}', password='${hashed_password}', email='${email}' WHERE id = ${id} `, function(err, rows){
            if(err) console.log(err);
        });
    }
}
/**
 * Created by wubo on 2017/8/22.
 */
const express = require('express');
const path = require('path');
const App = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'my_db'
});
connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.end();

App.use(express.static(path.resolve(__dirname, '../dist')));

App.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

const port = '8089';
const url = 'http://localhost:8089';
App.listen(port, function() {
    console.log('Server is open on %s', url);
});
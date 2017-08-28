/**
 * Created by wubo on 2017/8/22.
 */
const express = require('express');
const path = require('path');
const App = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test-database'
});

//第二次请求有问题
App.post('/login', function(req, res) {
    connection.connect();
    // console.log(JSON.stringify(req.body));
    if (!req.body) return res.sendStatus(400);
    var nickname = req.body.nickname;
    var password = req.body.password;
    console.log(nickname, password);
    connection.query("SELECT * from user where nickname = ? and password = ?", [nickname, password],
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                console.log('The solution is: ', results[0]);
                res.send(results[0]);
            } else {
                res.send('账号或密码错误');
            }
        });
    connection.end();
})


App.use(express.static(path.resolve(__dirname, '../dist')));

App.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

const port = '8089';
const url = 'http://localhost:8089';
App.listen(port, function() {
    console.log('Server is open on %s', url);
});
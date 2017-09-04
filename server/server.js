/**
 * Created by celine on 2017/8/30.
 */
const express = require('express');
const path = require('path');
const App = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var server = require('http').createServer(App);
var io = require('socket.io')(server);
const QiQiuYun = require('qiqiuyun-sdk');

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));

function initializeConnection(config) {
    function addDisconnectHandler(connection) {
        connection.on("error", function(error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

    var connection = mysql.createConnection(config);

    // Add handlers.
    addDisconnectHandler(connection);

    connection.connect();
    return connection;
}

var connection = initializeConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test-database'
});

App.post('/login', function(req, res) {
    // connection.connect();
    // console.log(JSON.stringify(req.body));
    if (!req.body) return res.sendStatus(400);
    var nickname = req.body.nickname;
    var password = req.body.password;
    console.log(nickname, password);
    var aaa;
    connection.query("SELECT * from user where nickname = ? and password = ?", [nickname, password],
        function(error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                console.log('The solution is: ', results[0]);
                res.send(results[0]);
                aaa = results[0];
            } else {
                res.send('账号或密码错误');
            }
        });
    // connection.end();
    console.log(123);
})


App.use(express.static(path.resolve(__dirname, '../dist')));

App.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

App.get('/play/token', function(req, res) {
    const resNo = req.query.resNo;
    const secretKey = '9e64ca5b4a446e9a0999d982';
    const token = QiQiuYun.generateToken(resNo, secretKey);
    console.log('token', token);
    res.send(token);
});

//socket连接
var users = [];
usocket = {};
io.on('connection', function(socket) {
    console.log('connection.');
    socket.on('user join', function(data) {
        console.log(data);
        // users[username] = username
    })
    socket.on('disconnect', function() {
        console.log('disconnect.');
    });
});


const port = '8099';
const url = 'http://localhost:8099';
server.listen(port, function() {
    console.log('Server is open on %s', url);
});
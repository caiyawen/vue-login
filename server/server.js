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
var usersInfo = [];
var roomInfo = [];
var arrAllSocket = [];

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
io.on('connection', function(socket) {
    console.log('connection');
    var url = socket.request.headers.referer;
    var roomID;
    var user;
    socket.on('join', function(userName) {
        console.log(userName);
        console.log(userName !== null && usersInfo.indexOf(userName) == '-1');
        user = userName;
        arrAllSocket[user] = socket;
        if (userName !== null && usersInfo.indexOf(userName) == '-1') {
            usersInfo.push(userName);
            // roomInfo.push({
            //     userName: userName,
            //     toUserName: false,
            //     msg: '加入了房间',
            // })
            io.sockets.emit('sys', usersInfo);
            // io.sockets.emit('msg', roomInfo, false);
            console.log(userName + '加入了', 'usersInfo', usersInfo);
        }
    });

    socket.on('leave', function() {
        socket.emit('disconnect');
        console.log('disconnect');
    });

    socket.on('disconnect', function() {
        console.log(user);
        var index = usersInfo.indexOf(user);
        if (index !== -1) {
            console.log('用户已存在');
            usersInfo.splice(index, 1);
        }
        // socket.leave(roomID);
        console.log(roomInfo);
        // roomInfo.push({
        //     userName: user,
        //     toUserName: false,
        //     msg: '退出了房间'
        // });
        // io.emit('msg', roomInfo);
        io.emit('sys', usersInfo)
        console.log(user + '退出了');
    });

    socket.on('message', function(userName, toUserName, msg, currentRoom) {
        // if (roomInfo.indexOf(userName) === 0) {
        //     return false;
        // }
        // roomInfo.userName = userName;
        // roomInfo.toUserName = toUserName;
        // roomInfo.msg = msg;
        console.log('currentRoom', currentRoom);
        roomInfo.push({
            userName,
            toUserName,
            msg
        });
        if (toUserName) {
            var toTarget = arrAllSocket[toUserName];
            var target = arrAllSocket[userName];
            console.log('私聊的人', toUserName);
            console.log('筛选后的值', roomInfo, currentRoom);
            toTarget.emit('msg', roomInfo, currentRoom);
            target.emit('msg', roomInfo, currentRoom);
            console.log('private');
        } else {
            console.log('roomInfo:', roomInfo, currentRoom);
            io.emit('msg', roomInfo, currentRoom);
        }
    });

    // socket.on('state', function(currentRoom) {
    //     roomInfo.push(currentRoom);
    //     console.log('state', roomInfo);
    // })

    socket.on('private', function(name) {
        console.log(name);
    })

    socket.on('disconnect', () => {
        console.log('连接已断开...');
    });
});


const port = '8099';
const url = 'http://localhost:8099';
server.listen(port, function() {
    console.log('Server is open on %s', url);
});
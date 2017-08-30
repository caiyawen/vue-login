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

//第二次请求有问题
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

//socket连接
io.on('connection', function(socket) {
    console.log('connection');
    var url = socket.request.headers.referer;
    var roomID;
    var user;

    socket.on('join', function(userName) {
        console.log(userName);
        user = userName;
        // roomID = obj.roomID;
        arrAllSocket[user] = socket;
        // if (!roomInfo[roomID]) {
        //     roomInfo[roomID] = [];
        // }
        // roomInfo[roomID].push(user);
        roomInfo.push(user);
        // socket.join(roomID);
        // io.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);
        io.emit('sys', user + '加入了房间');
        console.log(user + '加入了');
    });

    socket.on('leave', function() {
        socket.emit('disconnect');
        console.log('disconnect');
    });

    socket.on('disconnect', function() {
        var index = roomInfo.indexOf(user);
        if (index !== -1) {
            roomInfo.splice(index, 1);
        }
        // socket.leave(roomID);
        io.emit('sys', user + '退出了房间');
        console.log(user + '退出了');
    });

    socket.on('message', function(userName, toUserName, msg) {
        if (roomInfo.indexOf(userName) === -1) {
            return false;
        }
        console.log('userName', userName, 'toUserName', toUserName, 'msg', msg);
        if (toUserName) {
            var toTarget = arrAllSocket[toUserName];
            var target = arrAllSocket[userName];
            console.log(target);
            toTarget.emit('msg', userName, toUserName, msg);
            target.emit('msg', userName, toUserName, msg);
            console.log('private');
            return;
        }
        io.emit('msg', userName, toUserName, msg);
    });

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
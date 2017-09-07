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
var superagent = require('superagent');
var request = require("request");
var cheerio = require('cheerio');
var fs = require('fs'); 

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

function sendmsg(data) {
    io.emit('chat message', data);
}

function sendUserMsg(data) {
    if (data.to in usocket) {
        console.log('================')
        console.log('to' + data.to, data);
        usocket[data.to].emit('to' + data.to, data);
        usocket[data.user].emit('to' + data.user, data);
        console.log('================')
    }
}

//socket连接
var users = [];
var arrAllSocket = [];
io.on('connection', function(socket) {
    console.log('connection.');
    socket.on('user join', function(username) {
        console.log('user join');
        if (users.indexOf(username) == -1) {
            users.push(username);
        }
        console.log(users);
        user = username;
        arrAllSocket[user] = socket;
        io.emit('user join', users);
        // sendmsg(username);
    });
    socket.on('message', function(from, to, msg, type) {
        var target = arrAllSocket[to];
        var fromTarget = arrAllSocket[from];
        if (target) {
            target.emit('msg', from, to, msg, type);
            fromTarget.emit('msg', from, to, msg, type);
        } else {
            io.emit('msg', from, to, msg, type);
            console.log('群聊');
        }
    });
    socket.on('leave', function() {
      console.log('leave');
      io.emit('disconnect');
    })
    socket.on('disconnect', function() {
        console.log('disconnect.');
    });
    // socket.on('chat message', function(data) {
    //     var msg = data.msg;
    //     users[username] = data.user;
    //     data.msg = data.msg;
    //     console.log(data);
    //     if (!data.to) {
    //         console.log('public');
    //     } else {
    //         data.type = 2;
    //         console.log('private');
    //         sendUserMsg(data);
    //     }
    // })
});

//爬取头像图片
superagent.get('http://www.ui.cn/').end(function(err, docs) {
  var $ = cheerio.load(docs.text);
  var imgArr = [];
  console.log($('.post li .cover a img').length);
  $('.post li .cover a img').each(function(index, ele) {
    var $el = $(ele);
    imgArr.push($el.attr('data-original'));
  });
    console.log('imgArr', imgArr);
    imgArr.map((val, index) => {
      let file = val.split('/');
      console.log(file[file.length - 1]);
      downloadImg(val, file[file.length - 1]);
    })
})

var dir = './image';
var downloadImg = function(url, filename){
     request.get(url).on('response', function(response) {
       console.log(response.statusCode);
       console.log(response.headers['content-type']);
     }).pipe(fs.createWriteStream(dir + "/" + filename));
};

const port = '8099';
const url = 'http://localhost:8099';
server.listen(port, function() {
    console.log('Server is open on %s', url);
});
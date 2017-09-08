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

var users = [];
var usersArr = [];
var arrAllSocket = [];
var avatarImgArr = [];
var filesUrlArr = [];

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

io.on('connection', function(socket) {
    console.log('connection.');
    socket.on('user join', function(username) {
        console.log('user join111111', avatarImgArr);
        if (users.indexOf(username) == -1) {
            users.push(username);
            usersArr.push({name: username, avatar: avatarImgArr[Math.ceil(Math.random() * 20)]})
        }
        console.log(users);
        user = username;
        arrAllSocket[user] = socket;
        io.emit('user join', usersArr);
        console.log('user join', usersArr)
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
  console.log($('.post li .cover a img').length);
  $('.post li .cover a img').each(function(index, ele) {
    var $el = $(ele);
    avatarImgArr.push($el.attr('data-original'));
  });
    // console.log('avatarImgArr', avatarImgArr);
    avatarImgArr.map((val, index) => {
      filesUrlArr = val.split('/');
      // console.log(filesUrlArr[filesUrlArr.length - 1]);
      downloadImg(val, filesUrlArr[filesUrlArr.length - 1]);
    })
})

var dir = './image';
var downloadImg = function(url, filename){
    // request.head(url).on('response', function(response) {
    // //  console.log(response.statusCode);
    // //  console.log(response.headers['content-type']);
    // }).pipe(fs.createWriteStream(dir + "/" + filename));
    request({
      url: url,
      headers: {
        'Host': 'img0.imgtn.bdimg.com',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'If-None-Match': '90101f995236651aa74454922de2ad74',
        'Referer': 'http://www.ui.cn/',
        'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT',
        'Proxy-Connection':'keep-alive',
        'Cookie': 'Hm_lvt_cda1b423ea76ae745279bc4eb4734644=1504789096; Hm_lpvt_cda1b423ea76ae745279bc4eb4734644=1504789096',
      }
    }, function(error, response, body) {
      console.log(response.statusCode);
      console.log(response.headers['content-type']);
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.stargazers_count + " Stars");
        console.log(info.forks_count + " Forks");
      }
    }).pipe(fs.createWriteStream(dir + "/" + filename));
};

var options = {
  url: 'https://api.github.com/repos/request/request',
  headers: {
    'Host': 'img0.imgtn.bdimg.com',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'If-None-Match': '90101f995236651aa74454922de2ad74',
    'Referer': 'http://www.ui.cn/',
    'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT',
    'Proxy-Connection':'keep-alive',
    'Cookie': 'Hm_lvt_cda1b423ea76ae745279bc4eb4734644=1504789096; Hm_lpvt_cda1b423ea76ae745279bc4eb4734644=1504789096',
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
  }
}

const port = '8099';
const url = 'http://localhost:8099';
server.listen(port, function() {
    console.log('Server is open on %s', url);
});
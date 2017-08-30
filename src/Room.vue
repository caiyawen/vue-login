<template>
  <div class="chat page">
    <div class="chat-title">聊天室</div>
    <el-row :gutter="24">
        <el-col :span="8">
            <div class="chat-info">
                 <!-- <div>昵称: {{userName}}<div>  -->
                <!-- <div>房间: </div> -->
                <div>当前在线人数: <span id="count">{{users.length}}</span></div>
                <div>用户列表:
                    <ul v-for="user in users">
                      <li>{user}<button>私聊</button></li>
                    </ul>
                </div>
                <button @click="leave" class="btn chat-btn">退出房间</button>
            </div>
        </el-col>
        <el-col :span="16">
            <div class="chatArea">
                <ul class="messages">
                  {{message}}
                </ul>
            </div>
            <input class="inputMessage" v-model="msg" @keyup.enter="submit" placeholder="Type here..." />
        </el-col>
    </el-row>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'room',
  data() {
    return {
      message: '',
      users: '',
      userName: '',
      msg: '',
      toUserName: false,
    }
  },
  created() {
    this.socket = io.connect('127.0.0.1:8099');
    this.userName = this.$cookie.get('userName');
    let password = this.$cookie.get('password');    
    console.log('userName', this.userName, 'password', password);
    let self = this;
    this.socket.on('connect', function() {
      self.socket.emit('join', self.userName);
    });
    this.socket.on('msg', function(userName, toUserName, msg) {
        this.message = '' +
            '<div class="message">' +
            '  <span class="user">' + userName + ': </span>' +
            '  <span class="msg">' + msg + '</span>' +
            '</div>';
        // $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
    });
    this.socket.on('sys', function(sysMsg, users) {
        this.message = '<div class="sysMsg">' + sysMsg + '</div>';
        // $('#msglog').append(message);
        this.users = users;
        // $('#count').text(users.length);
        // $('#users').text('');
        // todo 按名字排序
        // users.map((val) => {
        //     $('#users').append(`<li>${val}</li><button id="${val}" class="private-chat">私聊</button`);
        // })
    });
  },
  methods: {
    leave() {
      console.log('leave')
      this.socket.emit('leave');
    },
    submit() {
      console.log('submit');
      this.socket.emit('message', this.userName, this.toUserName, this.msg);
    }
  }
}
</script>

<style lang="less">
.el-row, .el-col {
  height: 100%;
}
</style>



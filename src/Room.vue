<template>
  <div class="chat">
    <div class="chat-title">聊天室</div>
    <el-row :gutter="24">
        <el-col :span="5">
            <div class="chat-info">
              <button class="btn chat-btn" @click.once="group()">群聊大厅</button>
              <div>昵称: {{userName}}</div>
              <div>当前在线人数: {{usersInfo.length}}</div>
              <el-menu mode="vertical" default-active="1" class="el-menu-vertical-demo">
                <el-menu-item-group title="用户列表">
                  <el-menu-item index="1" v-for="user in usersInfo" @click="private(user)"><span v-if="user == currentRoom"><i class="el-icon-message"></i></span>{{user}}</el-menu-item>
                </el-menu-item-group>
              </el-menu> 
              <button @click="leave(userName)" class="btn leave-btn">退出房间</button>
            </div>
        </el-col>
        <el-col :span="19">
            <div class="chatArea">
                <ul class="messages">
                  <li v-for="message in roomInfo">name:{{message.userName}}, touserName: {{message.toUserName}}, msg: {{message.msg}}</li>
                </ul>
            </div>
            <textarea class="inputMessage" v-model="msg" @keyup.enter="submit" placeholder="Type here..." />
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
      usersInfo: '',
      roomInfo: '',
      userName: '',
      msg: '',
      toUserName: false,
      socket: '',
      currentRoom: false,
    }
  },
  watch: {
    usersInfo: {
      handler: function(val) {
        console.log(val);
      },
      deep: true
    }
  },
  created() {
    this.socket = io.connect('127.0.0.1:8099');
    this.userName = this.$cookie.get('userName');
    let password = this.$cookie.get('password');    
    console.log('userName', this.userName, 'password', password);
    this.socket.on('connect', () => {
      this.socket.emit('join', this.userName);
    });
    this.socket.on('msg', (roomInfo, currentRoom) => {
      let filterInfo;
      console.log('currentRoom', currentRoom, 'this.currentRoom', this.currentRoom);
      if (currentRoom === this.currentRoom && this.currentRoom) {
        filterInfo = roomInfo.filter((obj) => {
          return (obj.userName == this.toUserName && obj.toUserName == this.userName) || (obj.userName == this.userName && obj.toUserName == this.toUserName) && (this.toUserName);
        });
        console.log('private');
        this.roomInfo = filterInfo;
      } else {
        console.log('roomInfo', roomInfo);
         filterInfo = roomInfo.filter((obj) => {
          return (obj.toUserName == false);
        });
        console.log('filterInfo', filterInfo);
        this.roomInfo = filterInfo;
      }
    });
    this.socket.on('sys', (usersInfo) => {
      this.usersInfo = usersInfo;
      console.log('usersInfo', this.usersInfo);
    });
    this.socket.on('disconnect', () => {
      console.log('disconnect');
    })
  },
  methods: {
    leave() {
      console.log('leave');
      this.socket.emit('leave');
      this.$cookie.delete('userName');
      this.$cookie.delete('password');      
      this.$router.push({name: 'login'});      
    },
    submit() {
      console.log('submit');
      this.socket.emit('message', this.userName, this.toUserName, this.msg, this.currentRoom);      
    },
    private(user) {
      this.currentRoom = user;
      // this.socket.emit('state', this.currentRoom);
      // console.log('私聊roomInfo', this.roomInfo);
      this.toUserName = user;
      // var filterInfo = this.roomInfo.filter((obj) => {
      //   return (obj.userName == this.toUserName && obj.toUserName == this.userName) || (obj.userName == this.userName && obj.toUserName == this.toUserName) && (this.toUserName);
      // });
      // this.roomInfo = filterInfo;
      // console.log('filterInfo', filterInfo);
      // this.$router.push({name: 'room', params: {nameId: user}}); 
      this.socket.emit('message', this.userName, this.toUserName, this.msg, this.currentRoom);            
    },
    group() {
      this.toUserName = false;
      //this.socket.emit('message', this.userName, false, this.msg);
    }
  }
}
</script>

<style lang="less">
.el-row, .el-col {
  height: 100%;
  position: relative;
}
.leave-btn {
  position: absolute;
  bottom: 100px;
  left: 50%;
  margin-left: -29px;
  text-align: center;
}
</style>



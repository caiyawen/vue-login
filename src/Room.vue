<template>
  <div class="chat">
    <el-row :gutter="24">
        <el-col :span="5">
            <div class="chat-info">
              <button class="btn chat-btn" @click.once="group()">群聊大厅</button>
              <div> 昵称: {{userName}}</div>
              <div> 当前在线人数: {{usersInfo.length}}</div>
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
                  <li v-for="message in roomInfo">{{message.userName}} <span class="chat-msg">{{message.msg}}</span></li>
                </ul>
            </div>
            <div class="file-box">
              <span @click="dialogVisible = true"><i class="el-icon-message"></i></span>
            </div>
            <textarea class="inputMessage" v-model="msg" @keyup.enter="submit" placeholder="Type here..." />
            <el-dialog
              title="课件选择"
              :visible.sync="dialogVisible"
              size="tiny">
              <div class="block">
                <el-button type="success" @click="sendFile('56e61a5c78e74dc9ac0c0359efe0c75f')">课件1</el-button>
                <el-button type="warning" @click="sendFile('6b96aebadf6444fe8336a21d05965a6a')">课件2</el-button>
                <el-button type="danger" @click="sendFile('e6d0007015f842e7b946d33fafe286b9')">课件3</el-button>
                <el-button type="info" @click="sendFile('1f4991567c9841e3ab5bc37302936afe')">课件4</el-button>
              </div>
            </el-dialog>
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
      dialogVisible: false,
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
    });
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
      this.msg = '';   
    },
    private(user) {
      this.currentRoom = user;
      this.toUserName = user;
      this.socket.emit('message', this.userName, this.toUserName, this.msg, this.currentRoom);            
    },
    group() {
      this.toUserName = false;
    },
    sendFile(resNo) {
      this.$router.push({
        name: 'player',
        params: {
          id: resNo
        },
      })
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
.chat-msg {
  display: inline-block;
  margin-left: 10px;
  padding: 2px 8px;
  border-radius: 5px;
  background-color: darkgreen;
  color: #fff;
  position: relative;
  min-height: 28px;  
  &:before {
    content: '';
    position: absolute;
    left: -7px;
    top: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 8px 5px 0;
    border-color: transparent darkgreen transparent transparent;
  }
}
.file-box {
  position: absolute;
  left: -6px;
  width: 100%;
  padding-left: 10px;
  bottom: 120px;
  border: 2px solid #ddd;
  border-bottom: 0;
}
</style>



<template>
  <div class="chat">
    <el-row :gutter="24">
        <el-col :span="5">
            <div class="chat-info">
              <button class="btn chat-btn" @click="chatClick('group')">群聊大厅</button>
              <div> 昵称:{{ username }} </div>
              <div> 当前在线人数: </div>
              <el-menu mode="vertical" default-active="1" class="el-menu-vertical-demo">
                <el-menu-item-group title="用户列表">
                  <el-menu-item v-bind:key="index" index="index" v-for="(user, index) in userList">
                    <div @click="chatClick(user)">{{user}}</div>
                  </el-menu-item>
                </el-menu-item-group>
              </el-menu> 
              <button class="btn leave-btn" @click="leave">退出房间</button>
            </div>
        </el-col>
        <el-col :span="19">
            <div class="chatArea">
                <ul class="messages">
                  <li v-bind:key="index" v-for="(message, index) in msgList[to]">
                    from: {{ message.from }}, to:{{ message.to }}, message:{{ message.msg }}
                  </li>
                </ul>
            </div>
            <div class="file-box">
              <!-- <span @click="dialogVisible = true"><i class="el-icon-message"></i></span> -->
            </div>
            <textarea class="inputMessage" @keydown.enter="submit(msg)" v-model="msg" placeholder="Type here..." />
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
      username: '',
      to: '',
      msg: '',
      dialogVisible: false,
      userList: [],
      privateList: [],
      msgList: {},
      msgArr: [],
      socket: '',
    }
  },
  watch: {
    msgArr: {
      handler: function (val, oldVal) { 
        console.log(val);
       },
      deep: true
    }
  },
  created() {
    this.socket = io.connect('127.0.0.1:8099');
    this.username = this.$cookie.get('userName');
    
    this.socket.on('connect', () => {
      console.log('connect');
      this.socket.emit('user join', this.username);
      this.socket.on('user join', (users) => {
        this.userList = users;
      })
      this.socket.on('msg', (from, to, msg) => {
        console.log(from, to, msg);
        if (to == 'group') {  
            this.msgList['group'].push({from, to, msg});              
        } else {
            if (to == this.username) {
                if (!this.msgList[from]) {
                    this.$set(this.msgList, [from], []);
                }
                this.msgList[from].push({from, to, msg});
            } else {
                if (!this.msgList[to]) {
                    this.$set(this.msgList, [to], []);
                }
                this.msgList[to].push({from, to, msg});
            }
        }
        console.log(this.msgList); 
      })
    })
  },
  methods: {
    submit(msg) {
      this.socket.emit('message', this.username, this.to, msg);
      console.log(this.msgList);
    },
    chatClick(user) {
      this.to = user;
      if (!this.msgList[this.to]) {
        this.$set(this.msgList, [this.to], []);
        console.log(this.msgList); 
      }
    },
    leave() {
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
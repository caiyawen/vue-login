<template>
  <div class="chat-page">
    <el-row :gutter="24">
      <el-col :span="8" class="chat-list">
        <div class="chat-info">
          <button class="btn chat-btn" @click="chatClick('group')">群聊大厅</button>
          <div class="chat-intro">
            <div class="user-name">昵称:{{ username }} </div>
            <div>当前在线人数: </div>
          </div>
          <el-menu mode="vertical" default-active="1" class="el-menu-vertical-demo">
            <el-menu-item-group title="用户列表">
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
              <el-menu-item v-bind:key="index" :index="user.name" v-for="(user, index) in userList">
                <div @click="chatClick(user.name)">{{user.name}}
                  <el-badge class="mark" :value="user.unread" />
                </div>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
          <button class="btn leave-btn" @click="leave">退出房间</button>
        </div>
      </el-col>
      <el-col :span="16" class="chat-window">
        <div class="chatArea">
          <ul class="messages">
            <li v-bind:key="index" v-for="(message, index) in msgList[to]">
              <div v-if="message.from == username" class="chat-right">
                <span v-if="message.type == 'word'">
                  <span class="chat-msg right">{{ message.msg }}</span>{{ message.from }}
                </span>
                <span v-if="message.type == 'file'">
                  <span class="chat-msg right">
                    {{ message.from }}给你发了一个课件噢，
                    <router-link :to="{ path: `file${message.msg}` }">到新页面查看</router-link>，
                  </span>{{ message.from }}
                  <!-- <el-button type="text" @click="fileDialog = true">在当前页面查看</el-button> -->
                  <!-- <el-dialog title="课件查看" :visible.sync="fileDialog">
                    <player :resNo="message.msg"></player>
                  </el-dialog> -->
                </span>
              </div>
              <div v-else>      
                <span v-if="message.type == 'word'">
                  {{ message.from }}<span class="chat-msg" >{{ message.msg }}</span>
                </span>
                <span v-if="message.type == 'file'">
                  {{ message.from }}
                  <span class="chat-msg">
                    {{ message.from }}给你发了一个课件噢，
                    <router-link :to="{ path: `file${message.msg}` }">到新页面查看</router-link>，
                  </span>
                  <!-- <el-button type="text" @click="fileDialog = true">在当前页面查看</el-button> -->
                  <!-- <el-dialog title="课件查看" :visible.sync="fileDialog">
                    <player :resNo="message.msg"></player>
                  </el-dialog> -->
                </span>          
              </div>   
            </li>
          </ul>
        </div>
        <div class="file-box">
          <span @click="dialogVisible = true">
            <i class="el-icon-message"></i>
          </span>
        </div>
        <textarea class="inputMessage" @keydown.enter="submit(msg)" v-model="msg" placeholder="Type here..." />
        <el-dialog title="课件选择" :visible.sync="dialogVisible" size="tiny">
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
import Player from './Player.vue';

export default {
  components: {
    Player,
  },
  name: 'room',
  data() {
    return {
      username: '',
      to: '',
      msg: '',
      dialogVisible: false,
      fileDialog: false,
      userList: [],
      privateList: [],
      msgList: {},
      msgArr: [],
      socket: '',
      unread: {},
    }
  },
  watch: {
    msgArr: {
      handler: function(val, oldVal) {
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
        console.log(users);
        this.userList = [];
        users.map((val) => {
          if (val !== this.username) {
            console.log(this.userList);
            this.userList.push({ name: val, unread: 0 });
          }
        });
        console.log(this.userList)
      })
      this.socket.on('msg', (from, to, msg, type) => {
        console.log(from, to, msg, type);

        if (to == 'group') {
          if (!this.msgList['group']) {
            this.$set(this.msgList, ['group'], []);
          }
          this.msgList['group'].push({ from, to, msg, type });
        } else {
          if (to == this.username) {
            if (!this.msgList[from]) {
              this.$set(this.msgList, [from], []);
            }
            this.msgList[from].push({ from, to, msg, type });
          } else {
            if (!this.msgList[to]) {
              this.$set(this.msgList, [to], []);
            }
            this.msgList[to].push({ from, to, msg, type });
          }
        }
        if (this.to !== to && this.to !== from) {
          console.log('提示消息', from);
          this.userList.map((val) => {
            if (val.name == from) {
              val.unread += 1;
            }
          });
          console.log(this.userList);
        }
        console.log(this.msgList);
      });
      this.socket.on('disconnect', () => {
        console.log('disconnect');
      })
    })
  },
  methods: {
    submit(msg) {
      this.socket.emit('message', this.username, this.to, msg, 'word');
      this.msg = '';
      console.log(this.msgList);
    },
    chatClick(user) {
      this.to = user;
      this.userList.map((val) => {
        if (val.name == user) {
          val.unread = 0;
        }
      })
      if (!this.msgList[this.to]) {
        this.$set(this.msgList, [this.to], []);
        console.log(this.msgList);
      }
    },
    leave() {
      this.socket.emit('leave');
      this.$router.push({ name: 'login' });
    },
    sendFile(resNo) {
      this.dialogVisible = false;
      this.socket.emit('message', this.username, this.to, resNo, 'file');
    }
  }
}
</script>

<style lang="less">
.chat-page {
  width: 770px;
  height: 640px;
  margin: 30px auto;
  box-shadow: 0 6px 30px #999;
  .el-row,
  .el-col {
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
    position: relative;
  }
  // .chat-list {
  //   padding-right: 0 !important;
  // }
  .chat-window {
    background-color: #eee;
  }
  .el-menu {
    background-color: #f9f9f9;
    overflow: scroll;
    height: 548px;
    .el-menu-item:hover, .el-menu-item.is-active {
      background-color: #ddd;
    }
  }
  .inputMessage {
    position: absolute;
    bottom: 0;
    height: 120px;
    left: 0;
    outline: 0;
    border: 0;
    padding-left: 10px;
    width: 100%;
    resize: none;
  }
  .file-box {
    position: absolute;
    left: 0;
    width: 100%;
    padding: 10px;
    bottom: 120px;
    border-top: 1px solid #ddd;
    border-bottom: 0;
  }
  .chat-intro {
    padding: 20px;
    font-size: 14px;
    border-bottom: 1px solid #e1e1e1;
    .user-name {
      padding-bottom: 10px;
    }
  }
}

.leave-btn {
  position: absolute;
  bottom: 100px;
  left: 50%;
  margin-left: -29px;
  text-align: center;
}

.chat-right {
  text-align: right;
}

.chat-msg {
  display: inline-block;
  margin: 0 10px;
  padding: 2px 8px;
  border-radius: 5px;
  background-color: darkgreen;
  color: #fff;
  position: relative;
  min-height: 28px;
  &.right {
    &:before {
      left: auto;
      right: -5px;      
      border-width: 5px 0 5px 5px;
      border-color: transparent transparent transparent darkgreen;
    }
  }
  &:before {
    content: '';
    position: absolute;
    left: -5px;
    top: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 5px 5px 0;
    border-color: transparent darkgreen transparent transparent;
  }
}

</style>
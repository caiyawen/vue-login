<template>
    <div class="login page">
          <div class="form">
              <div class="login-logo"></div>
              <h3 class="title">给自己取个昵称吧～</h3>
              <input v-model="userName" class="usernameInput" type="text" maxlength="14" />
              <h3 class="title">输入密码</h3>                
              <input v-model="password" type="password" class="usernameInput">
              <div class="enter-btn">
                  <button id="submit" @click="login" class="btn btn-lg chat-btn">进入聊天室</button>
              </div>
          </div>
      </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      password: '',
      roomId: '',
    }
  },
  methods: {
    login() {            
      this.$axios.post('/login', {
        nickname: this.userName,
        password:this.password,
      }).then((res) => {
        if(res.data.nickname && res.data.password) {
          this.$cookie.set('userName', this.userName);
          this.$cookie.set('password', this.password);
          this.$router.push({name: 'room'});      
        } else {
          this.$message('名字或账号错误');
        }
      })
    }
  }
}
</script>

<style>
/* Login Page */

.login.page {
  background-color: darkseagreen;
}
.login-logo {
    height: 100px;
     /* background: url(../img/wochat.png) no-repeat center;  */
    margin-bottom: 30px;
}

.login.page .form {
  height: 100px;
  position: absolute;
  text-align: center;
  top: 15%;
  width: 100%;
}

.login.page .form .usernameInput {
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  padding-bottom: 15px;
  text-align: center;
  width: 400px;
}

.login.page .title {
  font-size: 150%;
}

.login.page .usernameInput {
  font-size: 150%;
  letter-spacing: 3px;
}

.login.page .title,
.login.page .usernameInput {
  color: #fff;
  font-weight: 100;
}
</style>


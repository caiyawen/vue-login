<template>
  <div>
    <p>login</p>
    <form v-on:submit.prevent>
      <input v-model="userName" type="text" placeholder="请输入名字">
      <input v-model="password"  type="text" placeholder="请输入密码">
      <button id="submit" @click="login">确定</button>
    </form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      userName: '',
      password: '',
    }
  },
  methods: {
    login() {
      // this.$router.push({name: 'user'});            
      this.$axios.post('/login', {
        nickname: this.userName,
        password:this.password,
      }).then((res) => {
        if(res.data.nickname && res.data.password) {
          this.$cookie.set('username', this.userName);
          this.$cookie.set('password', this.password);
          this.$router.push({name: 'user'});      
        } else {
          console.log('名字或账号错误');
        }
      })
    }
  }
}
</script>

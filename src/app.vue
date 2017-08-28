<template>
  <div id="app">
    <!-- <router-link :to="{ path: '/user' }">toUser</router-link>
    <router-link to="/user">toUser</router-link>
    <router-link :to="{ name: 'user' }">toUser</router-link> 
    <a href="javascript:;" @click="go">link</a> -->
    <!-- <router-link :to="{ name: 'login' }">Login</router-link>   -->
    <!-- <a href="javascript:;" @click="login">Login</a> -->
    <router-view></router-view>
  </div>
</template>

<script>
import myText from './text.vue';

export default {
  components: {
    myText,
  },
  methods: {
    go() {
      this.$router.push({
        name: 'info',
        params: {
          id: 123
        }
      })
    },
    login() {
      this.$router.push({
        name: 'login',
      })
    }
  }
}
</script>

<style lang="less">

</style>

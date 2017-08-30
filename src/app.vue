<template>
  <div id="app">
    <!-- <router-link :to="{ path: '/user' }">toUser</router-link> -->
    <!-- <router-link :to="{ name: 'login' }">Login</router-link>   -->
      <!-- <a href="javascript:;" @click="login">Login</a>  
      <a href="javascript:;" @click="go">link</a>   
    <router-link :to="{ name: 'user' }">toUser</router-link> 
    <router-link to="/user">toUser</router-link> -->
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

  }
}
</script>

<style lang="less">
  @import './less/main.less';
</style>

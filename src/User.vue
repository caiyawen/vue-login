<template>
  <div>
    <h1>titleaaaa</h1>
    <p>123</p>
    <router-view></router-view>
    <router-view name="a"></router-view>    
  </div>
</template>
<script>
export default {
  name: 'user',
  beforeRouteEnter: function(to, from, next) {
    // alert('beforeRouteEnter');
    next(true);
  },
  beforeRouteLeave: function(to, from, next) {
    // alert('beforeRouteLeave');
    next(true);
  }
}
</script>


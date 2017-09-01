<template>
  <ul class="messages">
    <li v-for="message in roomInfo">name:{{message.userName}}, touserName: {{message.touserName}}, msg: {{message.msg}}</li>
  </ul>
</template>

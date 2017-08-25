<template>
  <div>
    <input type="text" v-model="content" v-on:keyup.enter="submit">
    <ul v-for="(item,index) in arr">
        <li>{{item}}</li>
        <button v-on:click="deleteItem(index)">X</button>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: [],
      content: '',
    }
  },
   methods: {
    submit() {
        this.arr.push(this.content);
        this.content = '';
    },
    deleteItem(index) {
        this.arr.splice(index, 1);
    }
  }
}
</script>


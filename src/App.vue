<template>
  <nav-header></nav-header>
  <router-view/>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import { RouterView } from 'vue-router';
export default {
  name: 'App',
  components: {
    NavHeader,
    RouterView
  }
    
}
</script>


<style>
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin: 0;
  overflow: hidden;
}
body{
  margin: 0;
  overflow: hidden;
  position: fixed;
  width: 100vw;
  height: 100vh;
}

</style>
``
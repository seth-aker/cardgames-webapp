<template>
  <nav-header></nav-header>
  <router-view/>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'

export default {
  name: 'App',
  components: {
    NavHeader
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
}
body{
  margin: 0;
  overflow: hidden;
}

</style>
``
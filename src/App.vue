<script setup>
import NavHeader from '@/components/NavHeader.vue'
import axios from 'axios';

const currentToken = localStorage.getItem('token')
if (currentToken != null) {
axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}



</script>

<template>
  <nav-header></nav-header>
  <router-view/>
</template>
<style>
:root{
  --green-background: rgb(84, 134, 84);
  --green-background-light: rgb(116, 177, 116);
  --green-hover: rgb(116, 177, 116);
  --green-hover-light: rgb(135, 192, 135);
  --default-radius: 10px;
}
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin: 0;
  padding: 0;
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

<template>
  <nav-header></nav-header>
  <router-view />
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
/* App-specific styles are now handled by Tailwind in main.css */
</style>
``

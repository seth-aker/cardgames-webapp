<template>
  <div id="app" class="font-sans antialiased text-center text-white m-0 overflow-hidden">
    <nav-header></nav-header>
    <router-view />
  </div>
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
@import '@/assets/tailwind.css';

body {
  @apply m-0 overflow-hidden fixed w-screen h-screen;
}
</style>
``

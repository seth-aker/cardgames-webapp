<template>
  <main class="fixed h-full w-full z-1 bg-black bg-opacity-50 flex justify-center items-start overflow-hidden">
    <div class="relative flex flex-col border-2 border-white bg-green-700 top-50 w-300 p-4 text-center">
      <h2>Game Paused</h2>
      <p>Moves taken: {{ gameStore.matchingAttempts }}</p>
      <p>Time elapsed: {{ gameStore.gameTime }}</p>
      <p><a @click="resumeGame"
          class="text-white no-underline border-2 border-white rounded-10 p-1 px-2 m-1.25 cursor-pointer block">Resume
          Game</a></p>
      <p><a @click="startNewGame"
          class="text-white no-underline border-2 border-white rounded-10 p-1 px-2 m-1.25 cursor-pointer block">New
          Game</a></p>
      <p><router-link :to="{ name: 'main-menu' }"
          class="text-white no-underline border-2 border-white rounded-10 p-1 px-2 m-1.25 cursor-pointer block">Home</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore.js';
import { useRouter } from 'vue-router';

const gameStore = useGameStore();
const router = useRouter();

const resumeGame = () => {
  gameStore.resumeGame();
};

const startNewGame = () => {
  gameStore.clearMatching();
  gameStore.resumeGame();
  router.go();
};
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>

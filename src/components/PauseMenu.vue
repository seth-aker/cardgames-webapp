<template>
  <main class="fixed h-full w-full z-10 bg-black/50 flex justify-center items-start overflow-hidden">
    <div class="relative flex flex-col border-2 border-white bg-green-600 top-48 w-80 p-4 text-center">
      <h2>Game Paused</h2>
      <p>Moves taken: {{ gameStore.matchingAttempts }}</p>
      <p>Time elapsed: {{ gameStore.gameTime }}</p>
      <p><a @click="resumeGame"
          class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">Resume
          Game</a></p>
      <p><a @click="startNewGame"
          class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">New
          Game</a></p>
      <p><router-link :to="{ name: 'main-menu' }"
          class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">Home</router-link>
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
/* All styles converted to Tailwind CSS classes */
</style>

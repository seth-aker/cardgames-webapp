<template>
  <div class="fixed h-full w-full z-10 bg-black/50 flex justify-center items-start overflow-hidden">
    <div class="relative flex flex-col border-2 border-white bg-green-600 top-48 w-80 p-4 text-center">
      <h2>Select Difficulty</h2>
      <button @click="resumeGame"
        class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">Resume
        Game</button>
      <button @click="startNewGame"
        class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">New
        Game</button>

    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();


</script>

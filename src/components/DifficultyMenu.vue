<template>
  <div class="fixed h-full w-full z-10 bg-black/50 flex justify-center items-start overflow-hidden">
    <div class="relative flex flex-col border-2 border-white bg-green-600 top-48 w-80 p-4 text-center">
      <h2>Select Difficulty</h2>
      <p><a @click="startNewGame('easy')"
          class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">
          Easy
        </a></p>
      <p><a @click="startNewGame('medium')"
          class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">
          Medium
        </a></p>
      <p><a @click="startNewGame('hard')"
          class="text-white no-underline border-2 border-white rounded-xl py-2 px-3 my-2 cursor-pointer block hover:bg-green-500 hover:border-white/25">
          Hard
        </a></p>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();
const startNewGame = (difficulty) => {
  gameStore.startNewGame(difficulty);
}

</script>

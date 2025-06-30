<template>
    <main class="overlay">
      <div class="overlay-content">
        <h2>Game Paused</h2>
        <p>Moves taken: {{ gameStore.matchingAttempts }}</p>
        <p>Time elapsed: {{ gameStore.gameTime }}</p>
        <p><a @click="resumeGame">Resume Game</a></p>
        <p><a @click="startNewGame">New Game</a></p>
        <p><router-link :to="{name: 'main-menu'}">Home</router-link></p>
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
  .overlay{
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.522);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: hidden;
  }
  
  .overlay-content {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 2px white solid;
    background-color: rgb(84, 134, 84);
    top: 200px;
    width: 300px;
    padding: 1rem;
    text-align: center;
  }
  
  a{
    color: white;
    text-decoration: none;
    border: 2px white solid;
    border-radius: 10px;
    padding: 0.4rem 0.8rem;
    margin: 0.5rem 0;
    cursor: pointer;
    display: block;
  }
  
  a:hover{
    background-color: rgb(116, 177, 116);
    border: 2px rgba(255, 255, 255, 0.267) solid;
  }
  </style>
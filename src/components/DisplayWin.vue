<template>
  <main class="overlay" >
      <div class="overlay-content">
          <h2>	&#9733; &#9733; &#9733; You Win! &#9733; &#9733; &#9733;</h2>
          <p>Moves taken: {{ gameStore.matchingAttempts }}</p>
          <p>Time Taken: {{ gameStore.gameTime }}</p>
          <p><a @click="startNewGame" >New Matching Game</a></p>
          <p><router-link :to="{name: 'main-menu'}">Home</router-link></p>
      </div>
  </main>
</template>

<script>
import { useGameStore } from '@/stores/gameStore.js';

export default {
    setup() {
        const gameStore = useGameStore();
        return { gameStore };
    },
    methods: {
        startNewGame() {
            this.gameStore.clearMatching();
            this.$router.go(this.$router.currentRoute)
        }
    }
}
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
    border: 2px white solid ;
    background-color: rgb(84, 134, 84);
    top: 200px;
    width: 300px;
}

a{
    color: white;
    text-decoration: none;
    border: 2px white solid;
    border-radius: 10px;
    padding: 0.4rem 0.8rem;

}

a:hover{
    background-color: rgb(116, 177, 116);
    border: 2px rgba(255, 255, 255, 0.267) solid;
}
</style>

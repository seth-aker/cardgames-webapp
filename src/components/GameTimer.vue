<template>
  <p v-show="!isGameOver">Timer: {{ minutes }}:{{ seconds }}</p>
  <p v-show="isGameOver">Timer: {{ store.gameTime }}</p>
  <button @click="stopTimer">Stop</button>
  <button @click="startTimer">Start</button>
</template>

<script>
import getTimer from '../composables/getTimer'
import { useGameInfoStore } from '@/pinia/gameInfo';
export default {
    props: ['isGameOver'],
    name: 'GameTimer',
    setup() {
      const store = useGameInfoStore();
        const {seconds, minutes, startTimer, stopTimer} = getTimer();
  
      return {store, seconds, minutes, startTimer, stopTimer};
    },
    created(){
      this.startTimer();
    },
    watch: {
      isGameOver() {
        this.stopTimer();
      }
    }
    

}
</script>

<style>

</style>
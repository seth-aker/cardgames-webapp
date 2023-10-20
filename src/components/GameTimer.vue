<template>
  <div class="game-timer">
    <p v-show="!isGameOver">Timer: {{ minutes }}:{{ seconds }}</p>
    <p v-show="isGameOver">Timer: {{ store.gameTime }}</p>
    <!-- <div class="btn">
      <my-button :on-click="stopTimer">Stop Timer</my-button>
    </div>
    <div class="btn">
      <my-button :on-click="startTimer"> Start Timer</my-button>
    </div> -->
  </div>
</template>

<script>
import getTimer from '../composables/getTimer'
import { useGameInfoStore } from '@/pinia/gameInfo';
// import MyButton from './MyButton.vue'
export default {
    props: ['isGameOver'],
    name: 'GameTimer',
    components: {
    // MyButton,
},
    setup() {
      const store = useGameInfoStore();
      const {seconds, minutes, startTimer, stopTimer} = getTimer();
  
      return {store, seconds, minutes, startTimer, stopTimer};
    },
    created(){
      this.startTimer();
    },
    watch: {
      isGameOver(newValue, oldValue) {
        if(oldValue === false) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
      }
    }
    

}
</script>

<style scoped>
.game-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn { 
  width: 90%;
  height: 30px;
  margin: 5px;
}

</style>
<template>
  <p>Timer: {{ minutes }}:{{ formattedSeconds }}</p>
</template>

<script>
import { useGameStore } from '@/stores/gameStore.js';

export default {
props: ['isGameOver'],
setup() {
    const gameStore = useGameStore();
    return { gameStore };
},
data() {
    return {
        seconds: 0,
    }
},
created() {
    let interval = setInterval(() => {
        this.seconds++;
        if(this.isGameOver) {
            this.gameStore.logTime(`${this.timeLog.formattedMinutes}:${this.timeLog.seconds}`)
            clearInterval(interval);
        }
    }, 1000); 
},
computed: {
    minutes() {
        let m = this.seconds/60;
        if(m < 1){
            return '00';
        } 
        if(m < 10){
            return `0${Math.floor(m)}`;
        }
        return Math.floor(m);
       
    },
    formattedSeconds() {
        let s = this.seconds % 60;
        if(s === 0) {
            return '00';
        } 
        if(s < 10) {
            return `0${s}`;
        } else {
            return s;
        }
        
    },
    timeLog() {
        const time = {
            formattedMinutes: this.minutes,
            seconds: this.formattedSeconds
        };
        return time;
    }

}
}
</script>

<style>

</style>

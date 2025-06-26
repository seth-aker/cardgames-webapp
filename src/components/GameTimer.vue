<template>
  <p>Timer: {{ gameStore.gameTime }}</p>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore.js';
import { ref, onMounted, computed } from 'vue'

const {isGameOver} = defineProps({
    isGameOver: Boolean
})
const gameStore = useGameStore();

const seconds = ref(0)

const formattedMinutes = computed(() => {
    let m = seconds.value/60;
    if(m < 1){
        return '00';
    } 
    if(m < 10){
        return `0${Math.floor(m)}`;
    }
    return Math.floor(m).toString();
})
const formattedSeconds = computed(() => {
    let s = seconds.value % 60;
    if(s === 0) {
        return '00';
    } 
    if(s < 10) {
        return `0${s}`;
    } else {
        return s.toString();
    }
})

onMounted(() => {
    let interval = setInterval(() => {
        seconds.value++;
        gameStore.gameTime = `${formattedMinutes.value}:${formattedSeconds.value}`;
        if(isGameOver) {
            clearInterval(interval)
        }
    }, 1000)
})

</script>

<style>

</style>

<template>
<p>Timer: {{ gameStore.gameTime }}</p>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore.js';
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
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

// Watch for pause state changes
watch(() => gameStore.isPaused, (isPaused) => {
if (isPaused) {
    if (interval) clearInterval(interval);
} else if (!props.isGameOver) {
    startTimer();
}
})

let interval = null;

const startTimer = () => {
if (interval) clearInterval(interval);
interval = setInterval(() => {
    seconds.value++;
    gameStore.gameTime = `${formattedMinutes.value}:${formattedSeconds.value}`;
}, 1000);
}

onMounted(() => {
if (!gameStore.isPaused && !props.isGameOver) {
    startTimer();
}
})
</script>

<style>

</style>

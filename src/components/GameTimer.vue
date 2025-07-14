<template>
    <p>Timer: {{ gameStore.gameTime }}</p>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore.js';
import { ref, computed, watch } from 'vue'

const gameStore = useGameStore();

const seconds = ref(0)

const formattedMinutes = computed(() => {
    let m = seconds.value / 60;
    if (m < 1) {
        return '00';
    }
    if (m < 10) {
        return `0${Math.floor(m)}`;
    }
    return Math.floor(m).toString();
})
const formattedSeconds = computed(() => {
    let s = seconds.value % 60;
    if (s === 0) {
        return '00';
    }
    if (s < 10) {
        return `0${s}`;
    } else {
        return s.toString();
    }
})

const interval = ref(null)

// Watch for pause state changes
watch(() => gameStore.gameState, () => {
    if (gameStore.gameState !== 'playing') {
        if (interval.value) {
            clearInterval(interval.value);
            interval.value = null;
        }
    } else {
        startTimer();
    }
}, { immediate: true })

// Watch for gameTime reset
watch(() => gameStore.gameTime, (newTime) => {
    if (newTime === '00:00') {
        seconds.value = 0;
    }
})


const startTimer = () => {
    if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
    }
    interval.value = setInterval(() => {
        seconds.value++;
        gameStore.gameTime = `${formattedMinutes.value}:${formattedSeconds.value}`;
    }, 1000);
}

</script>

<style></style>

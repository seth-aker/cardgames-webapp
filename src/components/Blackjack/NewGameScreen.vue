<script setup>
import MyButton from '../MyButton.vue';
import { defineEmits } from 'vue';
const emit = defineEmits(['newGame'])
</script>

<template>
    <div class="overlay">
        <div class="overlay-content">
            <h2>Welcome!</h2>
            <p>The goal is to beat the dealer without going over 21</p>
            <p>Start by making a wager</p>
            <my-button class="btn" @click="emit('newGame')">Start</my-button>
        </div>

    </div>

</template>

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
    background-color: var(--green-background);
    top: 200px;
    width: 350px;
    align-items: center;
}

.btn {
    width: 75%;
    margin: 10px;
}
</style>
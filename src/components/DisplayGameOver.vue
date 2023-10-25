<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import { useGameInfoStore } from '@/pinia/gameInfo';
import { defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import MyButton from './MyButton.vue';
const bjStore = useBlackjackStore();
const infoStore = useGameInfoStore();

const emit = defineEmits(['newGame', 'gameOver'])
const router = useRouter();


</script>

<template>
    <div class="overlay">
        <div class="overlay-content">
            <h2> Game Over </h2>
            <p>Total Earnings: {{ bjStore.earnings }}</p>
            <p>Total Time: {{ infoStore.gameTime }}</p>
            <p>Rounds Played: {{ bjStore.sessionDTO.round }}</p>
            <my-button class="btn" @click="emit('newGame')">New Game</my-button>
            <my-button class="btn" v-show="!bjStore.gameSaved" @click="emit('gameOver')">Post to Scoreboard</my-button>
            <my-button class="btn" v-show="bjStore.gameSaved" @click="router.push({name: 'scoreboard'})">View Scoreboard</my-button>
            <my-button class="btn" @click="router.push({name: 'main-menu'})">Main Menu</my-button>
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
    width: 300px;
    align-items: center;
}

.btn {
    width: 75%;
    margin: 10px;
}


</style>
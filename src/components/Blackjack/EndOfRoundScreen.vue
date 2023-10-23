<script setup>
import MyButton from '../MyButton.vue';
import { useBlackjackStore } from "@/pinia/blackjack"


const bjStore = useBlackjackStore();

const cashOut = () => {
    bjStore.cashedOut = true;
    bjStore.clearHands();
    bjStore.showRoundOver = false;
}


const dealRound = () => {
    bjStore.clearHands();
    bjStore.showRoundOver = false;
}
</script>

<template>
    <div class="overlay">
        <div class="overlay-content">
            <h1>{{ bjStore.roundResult }}</h1>
            <p>Total Earnings: ${{ bjStore.earnings }}</p>
            <p>Wallet: ${{ bjStore.player.wallet }}</p>
            <MyButton class="btn" :on-click="dealRound">Play Again</MyButton>
            <MyButton class="btn" :on-click="cashOut">Cash Out</MyButton>
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
    padding: 15px;
}
h1 {
    margin: 10px;
}
.btn {
    width: 75%;
    margin: 10px;
}
</style>
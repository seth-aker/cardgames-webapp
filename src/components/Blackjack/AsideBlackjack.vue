<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import GameTimer from '../GameTimer.vue';
import MyButton from '../MyButton.vue';

const bjStore = useBlackjackStore();

const stand = () => {
    if(!bjStore.showUi) {
        bjStore.stand();
    }
}
const hit = () => {
    if(!bjStore.showUi) {
        bjStore.hit();
    }
}
</script>

<template>
    <aside>
        <div class="game-info">
            <p>Round: {{ bjStore.sessionDTO.round }}</p>
            <p>Earnings: ${{ bjStore.earnings }}</p>
            <p>Cards Remaining: {{ bjStore.cardsRemaining }}</p>
            <game-timer :isGameOver="bjStore.isGameOver"></game-timer>
        </div>
        <div class="btns">
            <my-button class="btn" :on-click="stand">Stand</my-button>
            <my-button class="btn" :on-click="hit">Hit</my-button>
        </div>
        
    </aside>

</template>

<style scoped>
.game-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 10px;
}

p {
    text-align: left;
}
.btns {
    padding: 0 10px 0 10px ;
}
.btn {
    
    height: 50px;
    margin-bottom: 5px;

}

</style>
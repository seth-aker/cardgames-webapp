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
            <p>Round: {{ bjStore.round }}</p>
            <p>Earnings: ${{ bjStore.earnings }}</p>
            <p>Cards Remaining: {{ bjStore.cardsRemaining }}</p>
            <game-timer :isGameOver="bjStore.isGameOver"></game-timer>

            <my-button :on-click="stand">Stand</my-button>
            <my-button :on-click="hit">Hit</my-button>
        </div>
        
    </aside>

</template>
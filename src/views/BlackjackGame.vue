<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import { useGameInfoStore } from '@/pinia/gameInfo';
import BlackjackService from '@/services/BlackjackService';
import CardContainer from '@/components/Blackjack/CardContainer.vue';
import GameTimer from '@/components/GameTimer.vue';
import BlackjackUI from '@/components/Blackjack/BlackjackUI.vue';
import { ref } from 'vue';

const bjStore = useBlackjackStore();
const store = useGameInfoStore();
const error = ref(null);
const startRound = async () => {
    try {
        const response = await BlackjackService.newGame();
        if(!response.status === 200) {
            throw Error("Couldn't connect to blackjack server")
        }
        bjStore.player.hand = response.data.player_hand;
        bjStore.dealer.hand = response.data.dealer_hand;
        bjStore.sessionId = response.data.session_id;
        bjStore.cardsRemaining = response.data.cards_remaining;
    } catch(err) {
        error.value = err.message;
    }
}

startRound();
store.pageTitle = "Let's Play Some Blackjack!"
</script>


<template>
    <aside>
        <game-timer></game-timer>
    </aside>
    
    <main>
        <div class="dealer">
            <card-container :hand="bjStore.dealer.hand" :isDealer="true" />
        </div>
        <div class="player">
            <card-container :hand="bjStore.player.hand" :isDealer="false" />
        </div>
        <div class="ui-container">
            <div class="money-info">
                <div class="wallet">
                    <h2>${{ bjStore.player.wallet }}</h2>
                </div>
                <div class="wager">
                    <h2>${{ bjStore.player.wager }}</h2>
                </div>
            </div>
            <blackjack-u-i class="ui" />
        </div>
    </main>
    
</template>

<style scoped>
main{
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.dealer, .player {
    height: 200px;
    display: flex;
    justify-items: center;
    max-width: 1100px;
    width: 100%
}
.ui-container {
    position: absolute;
    width: 75%;
    overflow: hidden;
    background: transparent; 
    display: flex;
    flex-direction: column;
}
.money-info{
    display: flex;
    background-color: var(--green-hover);
    
}
.ui {
    top: 100%;
    position: absolute;
    height: 100%;
    transition: all 300ms ease-in-out;
    background-color: var(--green-background)

}
</style>

<style>
.hidden .card .card-inner {
    -moz-transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -o-transform: rotateY(180deg);
    -ms-transform: rotateY(180deg);
    transform: rotateY(180deg); 
}
</style>
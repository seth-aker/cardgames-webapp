<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import { useGameInfoStore } from '@/pinia/gameInfo';
import BlackjackService from '@/services/BlackjackService';
import CardContainer from '@/components/Blackjack/CardContainer.vue';
import BlackjackUI from '@/components/Blackjack/BlackjackUI.vue';
import AsideBlackjack from '@/components/Blackjack/AsideBlackjack.vue';
import DisplayGameOver from '@/components/DisplayGameOver.vue';
import { ref } from 'vue';


const bjStore = useBlackjackStore();
const store = useGameInfoStore();
const error = ref(null);

const newGame = async () => {
    bjStore.$reset();
    try {
        const response = await BlackjackService.newGame();
        if(!response.status === 200) {
            throw Error("Couldn't connect to blackjack server")
        }
        bjStore.sessionDTO = response.data;
        bjStore.sessionId = response.data.session_id;
        bjStore.cardsRemaining = response.data.cards_remaining;
    } catch(err) {
        error.value = err.message;
    }
}


newGame();
store.pageTitle = "Let's Play Some Blackjack!";
</script>


<template>
    <div class="flex">
        <aside-blackjack></aside-blackjack>
        <main>
            <div class="dealer">
                <card-container :hand="bjStore.dealer.hand" :hiddenFirst="bjStore.isDealerCardHidden" />
            </div>
            <div class="player">
                <card-container :hand="bjStore.player.hand" :hiddenFirst="false" />
            </div>
            <div class="ui-container">
                <div class="money-info">
                    <div class="wallet">
                        <h2> Wallet: ${{ bjStore.player.wallet }}</h2>
                    </div>
                    <div class="wager">
                        <h2>Current Wager: ${{ bjStore.player.wager }}</h2>
                    </div>
                </div>
                <blackjack-u-i  class="ui" :class="{show: bjStore.showUi}"/>
            </div>
        </main>
        <display-game-over @newGame="newGame" v-show="bjStore.isGameOver"></display-game-over>
    </div>
    
</template>

<style scoped>
.flex {
    display: flex;
}

main{
    max-height: fit-content;
    width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: center;
}
aside {
    width: 10vw;
    height: 100vw;
    background-color: var(--green-hover);
    border-right: solid 3px white;
}   
.dealer, .player {
    height: 200px;
    display: flex;
    justify-content: center;
    max-width: 1100px;
    width: 100%
}
.ui-container {
    position: absolute ;
    width: max-content;
    overflow: hidden;
    background: transparent; 
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    bottom: 0;
    right: 0;
    transition: all 300ms ease-in-out;
}
.money-info{
    display: flex;
    background-color: var(--green-hover);
    width: min-content;
   
    border-top: 2px solid var(--green-background);
    border-left: 2px solid var(--green-background);
    border-radius: var(--default-radius) 0 0 0;
    
}
.wallet, .wager {
    padding: 10px;
    width: max-content
}

.ui {
    height: 0;
    overflow: hidden;
    transition: all 300ms ease-in-out;
    background-color: var(--green-hover);
    width: 100%;
}

.show {
    height: 150px;
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
<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import { useGameInfoStore } from '@/pinia/gameInfo';
import { useUserStore } from '@/pinia/user';
import BlackjackService from '@/services/BlackjackService';
import CardContainer from '@/components/Blackjack/CardContainer.vue';
import BlackjackUI from '@/components/Blackjack/BlackjackUI.vue';
import AsideBlackjack from '@/components/Blackjack/AsideBlackjack.vue';
import DisplayGameOver from '@/components/DisplayGameOver.vue';
import NewGameScreenVue from '@/components/Blackjack/NewGameScreen.vue';
import PointsDisplay from '@/components/Blackjack/PointsDisplay.vue';
import getHandValue from '@/composables/getHandValue';
import deepcopy from 'deepcopy';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router'
import EndOfRoundScreen from '@/components/Blackjack/EndOfRoundScreen.vue';

const userStore = useUserStore();
const bjStore = useBlackjackStore();
const store = useGameInfoStore();
const error = ref(null);
const router = useRouter();

const showNGScreen = ref(true);


const gameOver = async() => {
    if(userStore.isLoggedIn) {
        try {
            const response = await BlackjackService.saveFinalStats(bjStore.sessionDTO);
            if(response.status === 204) {
                bjStore.gameSaved = true;
            }
            else {
                throw new Error(response.statusText)
            }
        } catch (error) {
            console.log(error.message);
        }
    } else {
        router.push({name: 'login', query: {redirect: "/blackjack" }})
     }
}

const checkReturnedFromLogin = () => {
    if(bjStore.playerHandTotal != 0) {
        showNGScreen.value = false;
        gameOver();
    }
}
checkReturnedFromLogin();

const visibleHandTotal = computed(() => {
    const dealerHand = deepcopy(bjStore.dealer.hand);
    if(bjStore.isDealerCardHidden) {
        dealerHand.shift();
    }
    return getHandValue(dealerHand)
})

const newGame = async () => {
    showNGScreen.value = false;
    bjStore.$reset();
    try {
        const response = await BlackjackService.newGame();
        if(!response.status === 200) {
            throw Error("Couldn't connect to blackjack server")
        }
        bjStore.sessionDTO = response.data;
        bjStore.sessionId = response.data.session_id;
        bjStore.cardsRemaining = response.data.deck.remaining;
    } catch(err) {
        error.value = err.message;
    }
}


store.pageTitle = "Let's Play Some Blackjack!";
</script>


<template>
    <div class="flex">
        <aside-blackjack></aside-blackjack>
        <main>
            <div class="dealer">
                <card-container :hand="bjStore.dealer.hand" :hiddenFirst="bjStore.isDealerCardHidden" />
                <points-display class="points-display" :hand-value="visibleHandTotal" name="Dealer"></points-display>
            </div>
            <div class="player">
                <card-container :hand="bjStore.player.hand" :hiddenFirst="false" />
                <points-display class="points-display" :hand-value="bjStore.playerHandTotal" name="Player"></points-display>
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
        <display-game-over @gameOver="gameOver" @newGame="newGame" v-show="bjStore.isGameOver"></display-game-over>
        <NewGameScreenVue v-show="showNGScreen" @newGame="newGame"></NewGameScreenVue>
        <EndOfRoundScreen v-show="bjStore.showRoundOver"></EndOfRoundScreen>
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
    border-right: solid 3px var(--green-background);
}   
.dealer, .player {
    height: 200px;
    display: flex;
    justify-content: center;
    max-width: 1100px;
    width: 100%;
    margin: 20px
}

.points-display {
    position: absolute;
    right: 10vw;
    align-self: center;
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
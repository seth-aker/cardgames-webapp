<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import GameTimer from '../GameTimer.vue';
import MyButton from '../MyButton.vue';
import BlackjackService from '@/services/BlackjackService';
import { defineEmits, ref } from 'vue';
import mapGameToSessionDto from '@/composables/mapGameToSessionDto';
import { useGameInfoStore } from '@/pinia/gameInfo';


const bjStore = useBlackjackStore();
const infoStore = useGameInfoStore();
const emit = defineEmits(['revealHidden'])

const earnings = ref(0);

const stand = async () => {
    const deckId = bjStore.sessionDTO.deck.deck_id;
    emit('revealHidden')
    
    while(bjStore.dealerHandTotal < 17) {
        try {
            let response = await BlackjackService.drawCard(deckId, 1);
            if(!response.status === 200) {
                throw new Error("Error connecting to server")
            }
            bjStore.dealer.hand.push(response.data.cards[0]);
            bjStore.cardsRemaining = response.data.remaining;
        } catch (err) {
            console.log(err.message)
        }
    }
    calculateWinner();
}

const hit = async () => {
    const deckId = bjStore.sessionDTO.deck.deck_id;
    try {
        let response = await BlackjackService.drawCard(deckId, 1)
        if(!response.status === 200) {
            throw new Error("Error connecting to server")
        }
        bjStore.player.hand.push(response.data.cards[0]);
        bjStore.cardsRemaining = response.data.remaining;
    } catch(err) {
        console.log(err.message)
    }
    if(bjStore.playerHandTotal === 21) {
        bjStore.player.wallet += (bjStore.player.wager * 2);
        bjStore.player.wager = 0;
        try {
            bjStore.sessionDTO = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
        } catch (err) {
            console.log(err.message)
        }
    }
    if(bjStore.playerHandTotal > 21) {
        bjStore.player.wager = 0;
        try {
            bjStore.sessionDTO = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
        } catch (err) {
            console.log(err.message)
        }
    }
}

const calculateWinner = async () => {
    const deckId = bjStore.sessionDTO.deck.deck_id;
    if(bjStore.dealerHandTotal > 21 || bjStore.dealerHandTotal < bjStore.playerHandTotal) {
        bjStore.player.wallet += (bjStore.player.wager * 2);
        bjStore.player.wager = 0;
        const session = mapGameToSessionDto(bjStore, infoStore);
        bjStore.sessionDTO = session;
        try {
            bjStore.sessionDTO = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
        } catch (err) {
            console.log(err.message)
        }
    } 
    if(bjStore.dealerHandTotal > bjStore.playerHandTotal) {
        bjStore.player.wager = 0;
        const  session  = mapGameToSessionDto(bjStore, infoStore);
        bjStore.sessionDTO = session;
        try {
            bjStore.sessionDTO = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
        } catch (err) {
            console.log(err.message)
        }
    }
    if(bjStore.dealerHandTotal === bjStore.playerHandTotal) {
        bjStore.player.wallet += bjStore.player.wager;
        bjStore.player.wager = 0;
        const session = mapGameToSessionDto(bjStore, infoStore);
        bjStore.sessionDTO = session;
        try {
            bjStore.sessionDTO = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
        } catch (err) {
            console.log(err.message)
        }
    }
    bjStore.showUi = true;
}
</script>

<template>
    <aside>
        <div class="game-info">
            <p>Round: {{ bjStore.round }}</p>
            <p>Earnings: ${{ earnings }}</p>
            <p>Cards Remaining: {{ bjStore.cardsRemaining }}</p>
            <game-timer></game-timer>

            <my-button :on-click="stand">Stand</my-button>
            <my-button :on-click="hit">Hit</my-button>
        </div>
        
    </aside>

</template>
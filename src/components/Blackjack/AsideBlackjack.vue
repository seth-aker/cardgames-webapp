<script setup>
import { useBlackjackStore } from '@/pinia/blackjack';
import GameTimer from '../GameTimer.vue';
import MyButton from '../MyButton.vue';
import BlackjackService from '@/services/BlackjackService';
import { computed, defineEmits } from 'vue';
const bjStore = useBlackjackStore();

const emit = defineEmits(['revealHidden'])

const earnings = computed(() => {
    return bjStore.player.wallet - 500
})

const stand = async () => {
    emit('revealHidden')
    while(bjStore.dealerHandTotal < 17) {
        try {
            let response = await BlackjackService.drawCard(bjStore.sessionDTO.deck.deck_id, 1);
            if(!response.status === 200) {
                throw new Error("Error connecting to server")
            }
            bjStore.dealer.hand.push(response.data.cards[0]);
            bjStore.cardsRemaining = response.data.remaining;
        } catch (err) {
            console.log(err.message)
        }
    }


}

const hit = async () => {
    try {
        let response = await BlackjackService.drawCard(bjStore.sessionDTO.deck.deck_id, 1)
        if(!response.status === 200) {
            throw new Error("Error connecting to server")
        }
        bjStore.player.hand.push(response.data.cards[0]);
        bjStore.cardsRemaining = response.data.remaining;
    } catch(err) {
        console.log(err.message)
    }



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
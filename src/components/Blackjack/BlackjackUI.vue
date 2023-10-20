<script setup>
import MyButton from '../MyButton.vue';
import PokerChip from './PokerChip.vue';
import { useBlackjackStore } from '@/pinia/blackjack';
import { useGameInfoStore } from "@/pinia/gameInfo";
import checkForNaturals from "@/composables/checkForNaturals"
import BlackjackService from '@/services/BlackjackService';
import mapGameToSessionDto from '@/composables/mapGameToSessionDto'
const bjStore = useBlackjackStore();
const infoStore = useGameInfoStore();
//series of nested timeouts to deal cards to each player
const dealRound = async () => {
    bjStore.showUi = false    
    bjStore.player.hand.push(bjStore.sessionDTO.deck.cards.shift())
    setTimeout(()=> {
        bjStore.dealer.hand.push(bjStore.sessionDTO.deck.cards.shift())
        setTimeout(() => {
            bjStore.player.hand.push(bjStore.sessionDTO.deck.cards.shift())
            setTimeout(() => {
                bjStore.dealer.hand.push(bjStore.sessionDTO.deck.cards.shift())
                processResults();
            }, 750)
        }, 750)
    }, 750)
}
const processResults = async () => {
    const deckId = bjStore.sessionDTO.deck.deck_id;
    const hasDealerNatural = checkForNaturals(bjStore.dealer.hand);
    const hasPlayerNatural = checkForNaturals(bjStore.player.hand);

    if(hasDealerNatural && hasPlayerNatural) {
        resetWager();
        bjStore.sessionDTO = mapGameToSessionDto(bjStore, infoStore);
        try {
            const response = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
            if(!response.status === 200) {
            throw new Error("Error connecting to server")
            }
            bjStore.sessionDTO = response.data;
        } catch (err) {
            console.log(err.message)
        }
        clearHands();
    } else if (hasDealerNatural) {
        console.log("DEALER")
        bjStore.player.wager = 0;
        bjStore.sessionDTO = mapGameToSessionDto(bjStore, infoStore);
        try {
            const response = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
            if(!response.status === 200) {
            throw new Error("Error connecting to server")
            }
            bjStore.sessionDTO = response.data;
        } catch (err) {
            console.log(err.message)
        }
        clearHands();
    } else if (hasPlayerNatural) {
        console.log("PLAYER")
        bjStore.player.wallet += (bjStore.player.wager * 1.5);
        bjStore.player.wager = 0;
        bjStore.sessionDTO = mapGameToSessionDto(bjStore, infoStore);
        try {
            const response = await BlackjackService.newRound(deckId, bjStore.sessionDTO);
            if(!response.status === 200) {
            throw new Error("Error connecting to server")
            }
            bjStore.sessionDTO = response.data;
        } catch (err) {
            console.log(err.message)
        }
        clearHands();
    }

}

const addToPlayerWager = (amount) => {
    if(amount <= bjStore.player.wallet) {
        bjStore.player.wager += amount;
        bjStore.player.wallet -= amount;
    } else {
        alert("Cannot wager more than in current wallet.")
    }
}
const resetWager = () => {
    bjStore.player.wallet += bjStore.player.wager;
    bjStore.player.wager = 0;
}

const clearHands = () => {
    bjStore.player.hand = [];
    bjStore.dealer.hand = [];
    bjStore.showUi = true;
}
</script>

<template>
    <div class="ui">
        <div class="chips">
            <div @click="addToPlayerWager(chip.value)" v-for="(chip) in bjStore.chips" :key="chip.value">
                <PokerChip :value="chip.value" :src="chip.src" />
            </div>
        </div>
        <div class="btns">
            <MyButton class="wager-btn" :on-click="dealRound">Make Wager</MyButton>
            <MyButton class="wager-btn" :on-click="resetWager">Reset</MyButton>
        </div>
    </div>

</template>

<style scoped>
.ui {
    display: flex;
    align-items: center;
    border-top: 2px solid var(--green-background);
    border-left: 2px solid var(--green-background);
    border-radius: var(--default-radius) 0 0 0;
}
.chips {
    display: flex;
}

.btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
}
.wager-btn {
    height: 50px;
    margin: 5px;
}


</style>
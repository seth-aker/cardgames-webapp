<script setup>
import MyButton from '../MyButton.vue';
import PokerChip from './PokerChip.vue';
import { useBlackjackStore } from '@/pinia/blackjack';
const bjStore = useBlackjackStore();

const addToPlayerWager = (amount) => {
    if(amount <= bjStore.player.wallet) {
        bjStore.player.wager += amount;
        bjStore.player.wallet -= amount;
    }
}
const resetWager = () => {
    bjStore.player.wallet += bjStore.player.wager;
    bjStore.player.wager = 0;
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
            <MyButton class="wager-btn" :on-click="bjStore.dealRound">Make Wager</MyButton>
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
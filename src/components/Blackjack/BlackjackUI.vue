<script setup>
import PokerChip from './PokerChip.vue';
import { useBlackjackStore } from '@/pinia/blackjack';

const bjStore = useBlackjackStore();
const addToPlayerWager = (amount) => {
    if(amount <= bjStore.player.wallet) {
        bjStore.player.wager += amount;
        bjStore.player.wallet -= amount;
    } else {
        alert("Cannot wager more than in current wallet.")
    }
}

</script>

<template>
    <div class="ui">
        <div class="chips">
            <div @click="addToPlayerWager(chip.value)" v-for="(chip) in bjStore.chips" :key="chip.value">
                <PokerChip :value="chip.value" :color="chip.color" />
            </div>
        </div>
    </div>

</template>

<style scoped>
.money-info {
    display: flex;
}


</style>
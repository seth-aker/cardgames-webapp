<template>
    <aside>
        <game-timer></game-timer>
    </aside>
    
    <main>
        <div class="dealer">
            <blackjack-card class="card-container" 
                            v-for="(card, index) in dealerHand" 
                            :key="index" 
                            :class="{hidden: index === 0} " 
                            :card="card">
            </blackjack-card>
        </div>
        <div class="player">
            <blackjack-card class="card-container" 
                            v-for="(card, index) in playerHand" 
                            :key="index" 
                            :card="card">
            </blackjack-card>
        </div>
        <div class="ui">
            <poker-chip v-for="(chip) in chips" :key="chip.value" :value="chip.value" :color="chip.color"></poker-chip>
        </div>
    </main>
    
</template>

<script>
import BlackjackService from '@/services/BlackjackService';
import BlackjackCard from '@/components/BlackjackCard.vue';
import GameTimer from '@/components/GameTimer.vue';
import PokerChip from '@/components/PokerChip.vue';

export default {
    name: 'BlackjackGame',
    components: {
        GameTimer,
        BlackjackCard,
        PokerChip,
    },
    data() {
        return {
            pageTitle: 'Blackjack',
            chips: [{value: 1, color: 'grey'},
                    {value: 5, color: 'red'},
                    {value: 10, color: 'blue'},
                    {value: 25, color: 'green'},
                    {value: 50, color: 'orange'},
                    {value: 100, color: 'black'}]
        }
    },
    created() {
        this.$store.commit('UPDATE_PAGE_TITLE', this.pageTitle);
        BlackjackService.newGame()
        .then(response => {
            this.$store.dispatch('bj/setupBlackjack', response.data)
        })
    },
    computed: {
        dealerHand() {
            return this.$store.state.bj.dealer.hand;
        },
        playerHand() {
            return this.$store.state.bj.player.hand;
        },

    }
}
</script>

<style scoped>
main{
    height: 90vh;
}
.dealer {
    height: 200px;
    display: flex;

}
.player {
    height: 200px;
    display: flex;
}
.ui {
    position:absolute;
    display: flex;
}
.card-container {
    position: relative;;
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
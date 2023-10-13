<template>
    <aside>
        <game-timer></game-timer>
    </aside>
    
    <main>
        <div class="dealer">
            <card-container :hand="dealerHand" :isDealer="true" />
        </div>
        <div class="player">
            <card-container :hand="playerHand" :isDealer="false" />
        </div>
        <div class="ui">
            <poker-chip v-for="(chip) in chips" :key="chip.value" :value="chip.value" :color="chip.color"></poker-chip>
        </div>
    </main>
    
</template>

<script>
import BlackjackService from '@/services/BlackjackService';
import CardContainer from '@/components/Blackjack/CardContainer.vue';
import GameTimer from '@/components/GameTimer.vue';
import PokerChip from '@/components/Blackjack/PokerChip.vue';

export default {
    name: 'BlackjackGame',
    components: {
        GameTimer,
        CardContainer,
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
.ui {
    position:absolute;
    display: flex;
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
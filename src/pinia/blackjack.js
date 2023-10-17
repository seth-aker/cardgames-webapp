import { defineStore } from "pinia";
import getHandValue from "@/composables/getHandValue";

// import greyPC from "@/assets/poker-chip.grey.png";
// import redPC from "@/assets/poker-chip.red.png";
// import bluePC from "@/assets/poker-chip.blue.png";
// import greenPC from "@/assets/poker-chip.green.png";
// import orangePC from "@/assets/poker-chip.orange.png";
// import blackPC from "@/assets/poker-chip.black.png"
export const useBlackjackStore = defineStore('blackjackStore', {
    state: () => ({
        player: {
            hand: [],
            wallet: 500.00,
            wager: 0.00,
        },
        dealer: {
            hand: []
        },
        round: 1,
        sessionId: '',
        cardsRemaining: 0,

        chips: [{value: 1, src: './src/assets/poker-chip-grey.png'},
                {value: 5, src: './src/assets/poker-chip-red.png'},
                {value: 10, src: 'src/assets/poker-chip-blue.png'},
                {value: 25, src: 'src/assets/poker-chip-green.png'},
                {value: 50, src: 'src/assets/poker-chip-orange.png'},
                {value: 100, src: 'src/assets/poker-chip-black.png'}]
    }),

    getters: {
        playerHandTotal(state) {
           return getHandValue(state.player.hand)
        },

        dealerHandTotal(state) {
            return getHandValue(state.dealer.hand)
        }
    }
})
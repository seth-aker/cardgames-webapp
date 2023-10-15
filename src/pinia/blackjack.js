import { defineStore } from "pinia";
import getHandValue from "@/composables/getHandValue";

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

        chips: [{value: 1, color: 'grey'},
                {value: 5, color: 'red'},
                {value: 10, color: 'blue'},
                {value: 25, color: 'green'},
                {value: 50, color: 'orange'},
                {value: 100, color: 'black'}]
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
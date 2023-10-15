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
        sessionId: ''
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
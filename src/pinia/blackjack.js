import { defineStore } from "pinia";
import getHandValue from "@/composables/getHandValue";
export const useBlackjackStore = defineStore('blackjackStore', {
    state: () => ({
        
        /** Contains the information from the backend responses.
         * { session_id: Number,
            username: String,
            deck: {},
            player_money: Number,
            round: Number }
         */
        sessionDTO: {}, 
                                
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
        showUi: true,

        chips: [{value: 1, src: require('@/assets/poker-chip-grey.png')},
                {value: 5, src: require('@/assets/poker-chip-red.png')},
                {value: 10, src: require('@/assets/poker-chip-blue.png')},
                {value: 25, src: require('@/assets/poker-chip-green.png')},
                {value: 50, src: require('@/assets/poker-chip-orange.png')},
                {value: 100, src: require('@/assets/poker-chip-black.png')}]
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
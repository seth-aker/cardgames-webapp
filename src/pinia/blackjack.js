import { defineStore } from "pinia";
import getHandValue from "@/composables/getHandValue";
import BlackjackService from "@/services/BlackjackService";
import { useGameInfoStore } from "./gameInfo";
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
        isDealerCardHidden: true,
        earnings: 0,

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
        },
        isGameOver(state) {
            return state.player.wallet === 0 && state.player.wager === 0;
        }
    },
    actions: {
         async stand() {
            const deckId = this.sessionDTO.deck.deck_id;
            this.isDealerCardHidden = false
            
            while(this.dealerHandTotal < 17) {
                try {
                    let response = await BlackjackService.drawCard(deckId, 1);
                    if(!response.status === 200) {
                        throw new Error("Error connecting to server")
                    }
                    this.dealer.hand.push(response.data.cards[0]);
                    this.cardsRemaining = response.data.remaining;
                } catch (err) {
                    console.log(err.message)
                }
            }
            this.calculateWinner();
        },
        
        async hit() {
            const deckId = this.sessionDTO.deck.deck_id;
            try {
                let response = await BlackjackService.drawCard(deckId, 1)
                if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                }
                this.player.hand.push(response.data.cards[0]);
                this.cardsRemaining = response.data.remaining;
            } catch(err) {
                console.log(err.message)
            }
        
            if(this.playerHandTotal === 21) {
                this.player.wallet += (this.player.wager * 2);
                this.player.wager = 0;
                try {
                    this.sessionDTO = this.mapGameToSessionDto()
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
                this.clearHands();
            }
        
            if(this.playerHandTotal > 21) {
                this.player.wager = 0;
                try {
                    this.sessionDTO = this.mapGameToSessionDto();
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
                this.clearHands();
            }
        },
        async calculateWinner() {
            const deckId = this.sessionDTO.deck.deck_id;
            if(this.dealerHandTotal > 21 || this.dealerHandTotal < this.playerHandTotal) {
                this.player.wallet += (this.player.wager * 2);
                this.player.wager = 0;
              
                this.sessionDTO = this.mapGameToSessionDto();
                try {
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
            } 
            else if(this.dealerHandTotal > this.playerHandTotal) {
                this.player.wager = 0;
                this.sessionDTO = this.mapGameToSessionDto();
                try {
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
            }
             else if(this.dealerHandTotal === this.playerHandTotal) {
                this.player.wallet += this.player.wager;
                this.player.wager = 0;
                this.sessionDTO = this.mapGameToSessionDto();
                try {
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
            }
            this.clearHands();
        },
        async clearHands() {
            setTimeout(() => {
                this.isDealerCardHidden = true;
                this.player.hand = [];
                this.dealer.hand = [];
                this.showUi = true;
                this.updateEarnings();
            },1000)
            
        },
        mapGameToSessionDto() {
            const infoStore = useGameInfoStore();
            const sessionDTO = this.sessionDTO;
            sessionDTO.deck.cards = this.player.hand.concat(this.dealer.hand);
            sessionDTO.player_money = this.player.wallet;
            sessionDTO.round++;
            sessionDTO.time_seconds = infoStore.gameTimeSec;
            return sessionDTO 
        },
        updateEarnings() {
            this.earnings = (this.player.wallet - 500);
        }
    }
})
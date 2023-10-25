import { defineStore } from "pinia";
import getHandValue from "@/composables/getHandValue";
import BlackjackService from "@/services/BlackjackService";
import { useGameInfoStore } from "./gameInfo";
import checkForNaturals from "@/composables/checkForNaturals";
import mapGameToSessionDto from "@/composables/mapGameToSessionDto";
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
        sessionId: '',
        cardsRemaining: 0,
        showUi: true,
        isDealerCardHidden: true,
        earnings: 0,
        showRoundOver: false,
        roundResult: "",
        cashedOut: false,
        gameSaved: false,

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
            return (state.player.wallet === 0 && state.player.wager === 0) || state.cashedOut;
        }
    },
    actions: {
         async stand() {
            const deckId = this.sessionDTO.deck.deck_id;
            const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
            this.isDealerCardHidden = false
            
            while(this.dealerHandTotal < 17) {
                await sleep(750)
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
                this.updateEarnings();
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
                this.showRoundOver = true;
                this.roundResult = "Blackjack!"
            }
        
            if(this.playerHandTotal > 21) {
                this.player.wager = 0;
                this.updateEarnings();
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
                this.showRoundOver = this.computeShowRoundOver();
                this.roundResult = "Bust"
            }
        },
        async calculateWinner() {
            const deckId = this.sessionDTO.deck.deck_id;
            if(this.dealerHandTotal > 21 || this.dealerHandTotal < this.playerHandTotal) {
                this.player.wallet += (this.player.wager * 2);
                this.player.wager = 0;
                this.updateEarnings();
                if(this.dealerHandTotal > 21) {
                    this.roundResult = "Dealer Busted!"
                } else {
                    this.roundResult = "You win"
                }
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
                this.updateEarnings();
                this.sessionDTO = this.mapGameToSessionDto();
                this.roundResult = "Dealer Wins"
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
                this.updateEarnings();
                this.sessionDTO = this.mapGameToSessionDto();
                this.roundResult = "It's a tie! Push"
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
            this.showRoundOver = this.computeShowRoundOver();
        },
        async dealRound() {
            const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
            if(this.player.wager != 0) {
                this.showUi = false    
                this.player.hand.push(this.sessionDTO.deck.cards.shift())
                await sleep(750);
                this.dealer.hand.push(this.sessionDTO.deck.cards.shift())
                await sleep(750);
                this.player.hand.push(this.sessionDTO.deck.cards.shift())
                await sleep(750);
                this.dealer.hand.push(this.sessionDTO.deck.cards.shift())
                await sleep(750);
                this.processResults();
            } 
        },
        async processResults() {
            const infoStore = useGameInfoStore();
            const deckId = this.sessionDTO.deck.deck_id;
            const hasDealerNatural = checkForNaturals(this.dealer.hand);
            const hasPlayerNatural = checkForNaturals(this.player.hand);
        
            if(hasDealerNatural && hasPlayerNatural) {
                this.isDealerCardHidden = false;
                this.player.wallet += this.player.wager;
                this.player.wager = 0;
                this.updateEarnings();
                this.showRoundOver = true;
                this.roundResult = "Both Dealer and Player Got Naturals! Push"
                this.sessionDTO = mapGameToSessionDto(this, infoStore);
                try {
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
            } else if (hasDealerNatural) {
                this.isDealerCardHidden = false;
                this.player.wager = 0;
                this.updateEarnings();
                this.sessionDTO = mapGameToSessionDto(this, infoStore);
                this.showRoundOver = this.computeShowRoundOver();
                this.roundResult = "Dealer got a Natural!"
                try {
                    const response = await BlackjackService.newRound(deckId, this.sessionDTO);
                    if(!response.status === 200) {
                    throw new Error("Error connecting to server")
                    }
                    this.sessionDTO = response.data;
                } catch (err) {
                    console.log(err.message)
                }
            } else if (hasPlayerNatural) {
                this.isDealerCardHidden = false;
                this.player.wallet += (this.player.wager * 1.5);
                this.player.wager = 0;
                this.updateEarnings();
                this.sessionDTO = mapGameToSessionDto(this, infoStore);
                this.showRoundOver = true;
                this.roundResult = "You got a Natural"
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
        },
        async clearHands() {
            setTimeout(() => {
                this.isDealerCardHidden = true;
                this.player.hand = [];
                this.dealer.hand = [];
                this.showUi = true;
                this.updateEarnings();
            }, 150)
            
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
        },
        computeShowRoundOver() {
            if(this.player.wallet != 0) {
                return true;
            } else {
                return false;
            }
        }
    }
})
const state = () => ({
    player: {
        hand: [],
        wallet: 500.00,
        wager: 0.0,
    },
    dealer: {
        hand: []
    },
    round: 1,
    sessionId: '',

});

const mutations = {
    CLEAR_BLACKJACK(state) {
        state.player.hand = [],
        state.player.wallet = 500.00;
        state.player.wager = 0;
        state.dealer.hand = [];
        state.round = 1;
        state.sessionId = '';
    },
    INCREMENT_ROUND(state) {
        state.round++;
    },
    SET_SESSION_ID(state, sessionId) {
        state.sessionId = sessionId;
    },

    //hand mutations
    SET_PLAYER_HAND(state, hand) {
        state.player.hand = hand;
    },
    ADD_CARD_PLAYER_HAND(state, card) {
        state.player.hand.push(card);
    },
    CLEAR_PLAYER_HAND(state)  {
        state.player.hand = [];
    },
    SET_DEALER_HAND(state, hand) {
        state.dealer.hand = hand;
    },
    ADD_CARD_DEALER(state, card) {
        state.dealer.hand.push(card);
    },
    CLEAR_DEALER_HAND(state) {
        state.dealer.hand = [];
    },

    //money mutations
    SET_WALLET(state, money) {
        state.player.wallet = money;
    },
    SET_WAGER(state, wager) {
        state.player.wager = wager;
        state.player.wallet -= wager;
    }
} 

const getters = {
    playerHandTotal(state) {
        //number of aces in the players hand
        let aceCount = state.player.hand.filter(card => {
            return card.value === 'A'
        }).length

        //sums the value of the cards in a players hand
        let handSum = state.player.hand.reduce((total, card) => {
            let cardValue;
            switch (card.value) {
                case 'A': 
                    cardValue = 11;
                    break;
                case 'J': 
                case 'K': 
                case 'Q': 
                case '0':    
                    cardValue = 10
                    break;
                default: cardValue = Number(card.value)
                    break;
            } 
            return total + cardValue;
        }, 0);

        if(handSum <= 21) {
            return handSum;
        }
        //All aces in a hand are initially set to 11. 
        //If handSum is > 21, will set the value of one ace to 1. 
        //Loop continues until hand no longer has aces or handSum is <= 21; 
        while(handSum > 21 && aceCount > 0) {
            handSum -= 10;
            aceCount--;
        }
        return handSum;
    },

    dealerHandTotal(state) {
        //number of aces in the players hand
        let aceCount = state.dealer.hand.filter(card => {
            return card.value === 'A'
        }).length

        //sums the value of the cards in a players hand
        let handSum = state.dealer.hand.reduce((total, card) => {
            let cardValue;
            switch (card.value) {
                case 'A': 
                    cardValue = 11;
                    break;
                case 'J': 
                case 'K': 
                case 'Q': 
                case '0':    
                    cardValue = 10
                    break;
                default: cardValue = Number(card.value)
                    break;
            } 
            return total + cardValue;
        }, 0);

        if(handSum <= 21) {
            return handSum;
        }
        //All aces in a hand are initially set to 11. 
        //If handSum is > 21, will set the value of one ace to 1. 
        //Loop continues until hand no longer has aces or handSum is <= 21; 
        while(handSum > 21 && aceCount > 0) {
            handSum -= 10;
            aceCount--;
        }
        return handSum;
        },
}

const actions = {
    setupBlackjack({ commit }, gameSession) {
        commit('SET_SESSION_ID', gameSession.sessionId);
        commit('SET_PLAYER_HAND', gameSession.playerHand); //might need to be changed to player_hand
        commit('SET_DEALER_HAND', gameSession.dealerHand); //same here
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
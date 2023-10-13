const state = () => ({
    cards: [],
    cardsShowing: [],
    cardsMatched: [],
    matchingAttempts: 0,
    
});

const getters = {
    isMatchingOver(state) {
        if(state.cards.length !== 0){
          return state.cards.length === state.cardsMatched.length
        } else {
          return false;
        }
      },
};

const mutations = {
    CLEAR_MATCHING(state) {
        state.cards = [];
        state.cardsShowing = [];
        state.cardsMatched = [];
        state.matchingAttempts = 0;
      },
      ADD_CARD_MATCHING(state, card) {
        const cardCodes = state.cards.map((eachCard) => {
          return eachCard.code;
        })
        
        if(!cardCodes.includes(card[0].code)) {
          state.cards.push(card[0]);
        }
      },
      ADD_CARD_SHOWING(state, cardId) {
        state.cardsShowing.push(cardId);
      },
      CLEAR_SHOWING(state) {
        state.cardsShowing = [];
        state.matchingAttempts++;
      },
  
      ADD_MATCHING_CARDS(state, cardIds) {
        cardIds.forEach(cardId => {
          state.cardsMatched.push(cardId)
        })
      },
      
}

const actions = {
  
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
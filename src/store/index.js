import { createStore } from 'vuex'
import axios from 'axios';

const currentToken = localStorage.getItem('token')
const currentUser = JSON.parse(localStorage.getItem('user'));

if (currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export default createStore({
  state: {
    token: currentToken || '',
    user: currentUser || {},
    pageTitle: "Let's Play Some Card Games!",
    cards: [],
    cardsShowing: [],
    cardsMatched: [],
    matchingAttempts: 0,
    gameTime: '',
    
    
  },
  getters: {
    isGameOver(state) {
      if(state.cards.length !== 0){
        return state.cards.length === state.cardsMatched.length
      } else {
        return false;
      }
    }
  },
  mutations: {
    CLEAR_MATCHING(state) {
      state.cards = [];
      state.cardsShowing = [];
      state.cardsMatched = [];
      state.matchingAttempts = 0;
      state.gameTime = '';
    },
    UPDATE_PAGE_TITLE(state, pageTitle) {
      state.pageTitle = `Let's Play Some ${pageTitle}!`;
    },
    ADD_CARD(state, card) {
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
    LOG_TIME(state, time){
      state.gameTime = time;
    },
  },
  actions: {
  },
  modules: {

  }
})

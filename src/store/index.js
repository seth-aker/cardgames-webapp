import { createStore } from 'vuex'

export default createStore({
  state: {
    pageTitle: "Let's Play Some Card Games!",
    cards: [],
    cardsShowing: []
  },
  getters: {
  },
  mutations: {
    ADD_CARD(state, card) {
      state.cards.push(card);
    },
    ADD_CARD_SHOWING(state, cardId) {
      state.cardsShowing.push(cardId);
    },
    CLEAR_SHOWING(state) {
      state.cardsShowing = []
    }
  },
  actions: {
  },
  modules: {
  }
})

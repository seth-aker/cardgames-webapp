import { defineStore } from "pinia";

export const useMatchingStore = defineStore('matchingStore', {
    state: () => ({
        cards: [],
        cardsShowing: [],
        cardsMatched: [],
        matchingAttempts: 0,  
    }),
    getters: {
        isMatchingOver: (state) => {
            if(state.cards.length !== 0){
                return state.cards.length === state.cardsMatched.length
              } else {
                return false;
              }
        }
    }
})
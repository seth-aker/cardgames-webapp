import { defineStore } from "pinia";

export const useMatchingStore = defineStore('matchingStore', {
    state: () => ({
        cards: [],
        cardsShowing: [],
        cardsMatched: [],
        matchingAttempts: 0,  
    }),
    getters: {
        isGameOver: (state) => {
            if(state.cards.length !== 0){
                return state.cards.length === state.cardsMatched.length
              } else {
                return false;
              }
        }
    },
    actions: {
        addCards(cards) {
            const cardCodes = this.cards.map((eachCard) => {
                return eachCard.code;
              })
            cards.forEach(card => {
              if(!cardCodes.includes(card.code)) {
                  this.cards.push(card);
                }
            })
        }
    }
})
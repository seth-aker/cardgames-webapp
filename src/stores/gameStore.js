import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    pageTitle: "Let's Play Some Card Games!",
    cards: [],
    cardsShowing: [],
    cardsMatched: [],
    matchingAttempts: 0,
    gameTime: ''
  }),
  
  getters: {
    isGameOver: (state) => {
      if (state.cards.length !== 0) {
        return state.cards.length === state.cardsMatched.length
      } else {
        return false
      }
    }
  },
  
  actions: {
    clearMatching() {
      this.cards = []
      this.cardsShowing = []
      this.cardsMatched = []
      this.matchingAttempts = 0
      this.gameTime = ''
    },
    
    updatePageTitle(pageTitle) {
      this.pageTitle = `Let's Play Some ${pageTitle}!`
    },
    
    addCard(card) {
      const cardCodes = this.cards.map((eachCard) => {
        return eachCard.code
      })
      
      if (!cardCodes.includes(card[0].code)) {
        this.cards.push(card[0])
      }
    },
    
    addCardShowing(cardId) {
      this.cardsShowing.push(cardId)
    },
    
    clearShowing() {
      this.cardsShowing = []
      this.matchingAttempts++
    },
    
    addMatchingCards(cardIds) {
      cardIds?.forEach(cardId => {
        this.cardsMatched.push(cardId)
      })
    },
    
    logTime(time) {
      this.gameTime = time
    }
  }
})

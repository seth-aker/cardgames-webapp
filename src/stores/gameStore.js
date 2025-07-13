import { defineStore } from 'pinia'
import deckOfCardsAPI from '../services/deckOfCardsAPI'

export const useGameStore = defineStore('game', {
  state: () => ({
    pageTitle: "Let's Play Some Card Games!",
    cards: [],
    cardsShowing: [],
    cardsMatched: [],
    matchingAttempts: 0,
    gameTime: '00:00',
    gameState: 'not-started' // 'not-started' | 'playing' | 'finished' | 'paused'
  }),

  getters: {
    isGameOver: (state) => {
      if (state.cards.length !== 0) {
        return state.cards.length === state.cardsMatched.length
      } else {
        return false
      }
    },
    isPaused: (state) => {
      return state.gameState === 'paused'
    }
  },

  actions: {
    clearMatching() {
      this.cards = []
      this.cardsShowing = []
      this.cardsMatched = []
      this.matchingAttempts = 0
      this.gameTime = '00:00'
      this.gameState = 'not-started'
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
    togglePause() {
      this.gameState = 'paused'
    },
    resumeGame() {
      this.gameState = 'playing'
    },
    async startNewGame(difficulty) {
      const cards = 'AS,AC,KH,KD,3S,3C,4H,4D,5S,5C,6H,6D,7S,7C,8H,8D,9S,9C,0H,0D,JS,JC,QH,QD'
      const res = deckOfCardsAPI.createDeck(undefined,)
    }
  }
})

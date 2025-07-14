import { defineStore } from 'pinia'
import deckOfCardsAPI from '../services/deckOfCardsAPI'
import { shuffleArray } from '../utils/shuffleArray'

export const useGameStore = defineStore('game', {
  state: () => ({
    pageTitle: "Let's Play Some Card Games!",
    cards: [],
    cardsShowing: [],
    cardsMatched: [],
    matchingAttempts: 0,
    gameTime: '00:00',
    gameState: 'not-started', // 'not-started' | 'playing' | 'finished' | 'paused',
    difficulty: 'medium'
  }),

  getters: {
    isGameOver: (state) => {
      if (state.cards.length !== 0) {
        return state.cards.length === state.cardsMatched.length
      } else {
        return false
      }
    },
    isPaused: (state) => state.gameState === 'paused'
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
    async getCards(deckId) {
      const response = await deckOfCardsAPI.drawCard(deckId)
      if (response.data.remaining >= 0) {
        this.addCard(response.data.cards)
        if (response.data.remaining > 0)
          this.getCards(deckId)
      }
    },
    startNewGame(difficulty) {
      this.difficulty = difficulty;
      let cardPairs = ['AD,AH', 'AS,AC', '2D,2H', '2S,2C', '3D,3H', '3S,3C', '4D,4H', '4C,4S', '5H,5D', '5S,5C', '6H,6D', '6S,6C', '7H,7D', '7S,7C', '8H,8D', '8S,8C', '9H,9D', '9S,9C', '10D,10H', '10S,10C', 'JH,JD', 'JS,JC', 'QH,QD', 'QS,QC', 'KD,KH', 'KS,KC']
      shuffleArray(cardPairs);
      switch (difficulty) {
        case 'easy':
          cardPairs = cardPairs.slice(0, 12)
          break;
        case 'medium':
          cardPairs = cardPairs.slice(0, 18)
          break;
        case 'hard':
        default:
          cardPairs = cardPairs.slice(0, 24)
          break;
      }
      deckOfCardsAPI.createDeck(undefined, cardPairs.join(',')).then((res) => {
        if (!res.data.deck_id) {
          throw new Error('An error occured fetching deck of cards')
        }
        this.getCards(res.data.deck_id);
      })
      this.gameState = 'playing'
    }
  }
})

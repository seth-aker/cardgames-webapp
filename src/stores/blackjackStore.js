import { defineStore } from 'pinia'

export const useBlackjackStore = defineStore('blackjack', {
  state: () => ({
    chips: 1000,
    currentBet: 0,
    wins: 0,
    losses: 0,
    playerHands: [[]], // Array of hands to support splitting
    currentHandIndex: 0, // Which hand is currently being played
    dealerHand: [],
    dealerCardsRevealed: [], // Track which dealer cards are face up
    gamePhase: 'betting', // 'betting', 'playing', 'gameOver'
    playerBusted: [false], // Array to track busted status for each hand
    dealerBusted: false,
    playerBlackjack: [false], // Array to track blackjack for each hand
    dealerBlackjack: false,
    handBets: [0], // Bet amount for each hand
    isSplit: false
  }),

  getters: {
    canPlaceBet: (state) => {
      return state.chips > 0 && state.gamePhase === 'betting'
    },

    canHit: (state) => {
      return state.gamePhase === 'playing' && !state.playerBusted[state.currentHandIndex]
    },

    canStand: (state) => {
      return state.gamePhase === 'playing'
    },

    canDoubleDown: (state) => {
      return state.gamePhase === 'playing' &&
        state.playerHands[state.currentHandIndex].length === 2 &&
        state.chips >= state.handBets[state.currentHandIndex]
    },

    canSplit: (state) => {
      const currentHand = state.playerHands[state.currentHandIndex]
      return state.gamePhase === 'playing' &&
        currentHand.length === 2 &&
        currentHand[0].value === currentHand[1].value &&
        state.chips >= state.handBets[state.currentHandIndex] &&
        state.playerHands.length < 4 // Limit to 4 hands max
    },

    currentHand: (state) => {
      return state.playerHands[state.currentHandIndex] || []
    },

    allHandsComplete: (state) => {
      return state.currentHandIndex >= state.playerHands.length - 1
    },

    dealerVisibleHand: (state) => {
      // Return only the cards that are currently visible
      return state.dealerHand.filter((_, index) => state.dealerCardsRevealed[index])
    },

    dealerVisibleValue: (state) => {
      // Calculate value of currently visible dealer cards
      const visibleHand = state.dealerVisibleHand
      if (visibleHand.length === 0) return 0
      
      // Debug: log the visible hand for troubleshooting
      // console.log('Visible hand:', visibleHand)
      
      return calculateHandValue(visibleHand)
    }
  },

  // Helper function for calculating hand value (available to getters)
  calculateHandValue(hand) {
    let value = 0
    let aces = 0

    for (const card of hand) {
      const cardValue = card.value
      if (cardValue === 'ACE') {
        aces++
        value += 11
      } else if (['KING', 'QUEEN', 'JACK'].includes(cardValue)) {
        value += 10
      } else {
        value += parseInt(cardValue)
      }
    }

    // Handle aces
    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }

    return value
  },

  actions: {
    placeBet(amount) {
      if (this.chips >= amount && this.gamePhase === 'betting') {
        this.currentBet += amount
        this.chips -= amount
      }
    },

    dealInitialCards(playerCards, dealerCards) {
      this.playerHands = [[...playerCards]]
      this.dealerHand = [...dealerCards]
      this.dealerCardsRevealed = [true, false] // First card face up, second face down
      this.gamePhase = 'playing'
      this.playerBusted = [false]
      this.dealerBusted = false
      this.playerBlackjack = [false]
      this.dealerBlackjack = false
      this.handBets = [this.currentBet]
      this.currentHandIndex = 0
      this.isSplit = false
    },

    playerHit(card) {
      this.playerHands[this.currentHandIndex].push(card)
    },

    splitHand() {
      const currentHand = this.playerHands[this.currentHandIndex]
      if (currentHand.length === 2 && currentHand[0].value === currentHand[1].value) {
        // Create new hand with second card
        const newHand = [currentHand[1]]
        this.playerHands.push(newHand)

        // Remove second card from current hand
        this.playerHands[this.currentHandIndex] = [currentHand[0]]

        // Set up betting and status for new hand
        this.handBets.push(this.handBets[this.currentHandIndex])
        this.playerBusted.push(false)
        this.playerBlackjack.push(false)

        // Deduct chips for split bet
        this.chips -= this.handBets[this.currentHandIndex]

        this.isSplit = true
      }
    },

    nextHand() {
      if (this.currentHandIndex < this.playerHands.length - 1) {
        this.currentHandIndex++
        return true
      }
      return false
    },

    dealerHit(card) {
      this.dealerHand.push(card)
      this.dealerCardsRevealed.push(false) // New cards start face down
    },

    revealDealerCard(index) {
      if (index < this.dealerCardsRevealed.length) {
        this.dealerCardsRevealed[index] = true
      }
    },

    revealAllDealerCards() {
      this.dealerCardsRevealed = this.dealerCardsRevealed.map(() => true)
    },

    playerBust() {
      this.playerBusted[this.currentHandIndex] = true
    },

    playerStand() {
      // Game continues to next hand or dealer play
    },

    doubleDown() {
      const handBet = this.handBets[this.currentHandIndex]
      if (this.chips >= handBet) {
        this.chips -= handBet
        this.handBets[this.currentHandIndex] *= 2
      }
    },

    endGame(dealerBlackjack = false, dealerBusted = false) {
      this.gamePhase = 'gameOver'
      this.dealerBlackjack = dealerBlackjack
      this.dealerBusted = dealerBusted

      // Calculate winnings for each hand
      const dealerValue = this.calculateHandValue(this.dealerHand)

      this.playerHands.forEach((hand, index) => {
        const handValue = this.calculateHandValue(hand)
        const handBet = this.handBets[index]
        const isBlackjack = handValue === 21 && hand.length === 2

        if (this.playerBusted[index]) {
          // Hand busted, no chips returned
          this.losses++
        } else if (dealerBusted) {
          // Dealer busted, hand wins
          this.chips += handBet * 2
          this.wins++
        } else if (isBlackjack && !dealerBlackjack) {
          // Hand blackjack wins 3:2
          this.chips += Math.floor(handBet * 2.5)
          this.wins++
        } else if (dealerBlackjack && !isBlackjack) {
          // Dealer blackjack, hand loses
          this.losses++
        } else if (isBlackjack && dealerBlackjack) {
          // Both blackjack, push
          this.chips += handBet
        } else {
          // Compare hand values
          if (handValue > dealerValue) {
            this.chips += handBet * 2
            this.wins++
          } else if (handValue < dealerValue) {
            this.losses++
          } else {
            // Push
            this.chips += handBet
          }
        }
      })
    },

    calculateHandValue(hand) {
      let value = 0
      let aces = 0

      for (const card of hand) {
        const cardValue = card.value
        if (cardValue === 'ACE') {
          aces++
          value += 11
        } else if (['KING', 'QUEEN', 'JACK'].includes(cardValue)) {
          value += 10
        } else {
          value += parseInt(cardValue)
        }
      }

      // Handle aces
      while (value > 21 && aces > 0) {
        value -= 10
        aces--
      }

      return value
    },

    resetGame() {
      this.playerHands = [[]]
      this.dealerHand = []
      this.dealerCardsRevealed = []
      this.currentBet = 0
      this.currentHandIndex = 0
      this.gamePhase = 'betting'
      this.playerBusted = [false]
      this.dealerBusted = false
      this.playerBlackjack = [false]
      this.dealerBlackjack = false
      this.handBets = [0]
      this.isSplit = false

      // Reset chips if player is broke
      if (this.chips <= 0) {
        this.chips = 1000
        this.wins = 0
        this.losses = 0
      }
    }
  }
})

<template>
  <div id="blackjack">
    <aside>
      <h2>Blackjack</h2>
      <div class="game-info">
        <p>Chips: ${{ blackjackStore.chips }}</p>
        <p>Bet: ${{ blackjackStore.currentBet }}</p>
        <p>Wins: {{ blackjackStore.wins }}</p>
        <p>Losses: {{ blackjackStore.losses }}</p>
      </div>
      <div class="betting-controls" v-if="blackjackStore.gamePhase === 'betting'">
        <h3>Place Your Bet</h3>
        <div class="bet-buttons">
          <button @click="placeBet(5)" :disabled="blackjackStore.chips < 5">$5</button>
          <button @click="placeBet(10)" :disabled="blackjackStore.chips < 10">$10</button>
          <button @click="placeBet(25)" :disabled="blackjackStore.chips < 25">$25</button>
          <button @click="placeBet(50)" :disabled="blackjackStore.chips < 50">$50</button>
        </div>
        <button @click="dealCards" :disabled="blackjackStore.currentBet === 0" class="deal-button">Deal Cards</button>
      </div>
      <div class="game-controls" v-if="blackjackStore.gamePhase === 'playing'">
        <button @click="hit" :disabled="blackjackStore.playerBusted[blackjackStore.currentHandIndex]">Hit</button>
        <button @click="stand">Stand</button>
        <button @click="doubleDown" v-if="blackjackStore.canDoubleDown">Double Down</button>
        <button @click="split" v-if="blackjackStore.canSplit">Split</button>
      </div>
      <div class="new-game-controls" v-if="blackjackStore.gamePhase === 'gameOver'">
        <button @click="newGame" class="new-game-button">New Game</button>
      </div>
    </aside>
    <main>
      <div class="game-area">
        <div class="dealer-section">
          <h3>Dealer ({{ dealerHandValue }})</h3>
          <div class="hand">
            <playing-card v-for="(card, index) in blackjackStore.dealerHand" :key="`dealer-${card.code}`"
              :imageUrl="shouldShowDealerCard(index) ? card.image : cardBackUrl" :cardName="card.code"
              :isFlipped="shouldShowDealerCard(index)" :disabled="true" />
          </div>
        </div>

        <div class="player-section">
          <div v-for="(hand, handIndex) in blackjackStore.playerHands" :key="`hand-${handIndex}`" class="player-hand">
            <h3 :class="{ 'current-hand': handIndex === blackjackStore.currentHandIndex }">
              Hand {{ handIndex + 1 }} ({{ getHandValue(hand) }})
              <span v-if="blackjackStore.isSplit"> - ${{ blackjackStore.handBets[handIndex] }}</span>
            </h3>
            <div class="hand">
              <playing-card v-for="card in hand" :key="`player-${handIndex}-${card.code}`" :imageUrl="card.image"
                :cardName="card.code" :isFlipped="true" :disabled="true" />
            </div>
          </div>
        </div>

        <div class="game-message" v-if="gameMessage">
          <h2>{{ gameMessage }}</h2>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PlayingCard from '@/components/PlayingCard.vue'
import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
import { useBlackjackStore } from '@/stores/blackjackStore.js'
import { useGameStore } from '@/stores/gameStore.js'

const blackjackStore = useBlackjackStore()
const gameStore = useGameStore()

const pageTitle = 'Blackjack'
const cardBackUrl = ref('https://www.deckofcardsapi.com/static/img/back.png')
const deckId = ref('')
const cardsDrawn = ref(0)
const totalCards = ref(312) // 6 decks * 52 cards

// Computed properties
const dealerHandValue = computed(() => {
  if (blackjackStore.gamePhase === 'playing') {
    // Only show first card value during play
    return calculateHandValue([blackjackStore.dealerHand[0]])
  }
  return calculateHandValue(blackjackStore.dealerHand)
})

const gameMessage = computed(() => {
  if (blackjackStore.gamePhase === 'gameOver') {
    return 'Game Over! Check your results.'
  }
  return ''
})

// Methods
const calculateHandValue = (hand) => {
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
}

const getHandValue = (hand) => {
  return calculateHandValue(hand)
}

const shouldShowDealerCard = (index) => {
  return blackjackStore.gamePhase === 'gameOver' || blackjackStore.dealerCardsRevealed[index]
}

const placeBet = (amount) => {
  blackjackStore.placeBet(amount)
}

const dealCards = async () => {
  try {
    // Draw 4 cards (2 for player, 2 for dealer)
    const response = await drawCardWithTracking(4)
    const cards = response.data.cards

    blackjackStore.dealInitialCards([cards[0], cards[2]], [cards[1], cards[3]])

    // Check for blackjacks
    const playerVal = calculateHandValue(blackjackStore.currentHand)
    const dealerVal = calculateHandValue(blackjackStore.dealerHand)

    if (playerVal === 21 || dealerVal === 21) {
      blackjackStore.endGame(dealerVal === 21, dealerVal > 21)
    }
  } catch (error) {
    console.error('Error dealing cards:', error)
  }
}

const hit = async () => {
  try {
    const response = await drawCardWithTracking(1)
    const card = response.data.cards[0]

    blackjackStore.playerHit(card)

    const handValue = calculateHandValue(blackjackStore.currentHand)
    if (handValue > 21) {
      blackjackStore.playerBust()
      await checkNextHand()
    }
  } catch (error) {
    console.error('Error hitting:', error)
  }
}

const stand = async () => {
  blackjackStore.playerStand()
  await checkNextHand()
}

const doubleDown = async () => {
  blackjackStore.doubleDown()
  await hit()
  if (!blackjackStore.playerBusted[blackjackStore.currentHandIndex]) {
    await checkNextHand()
  }
}

const split = async () => {
  try {
    blackjackStore.splitHand()

    // Draw a card for each split hand
    const response1 = await drawCardWithTracking(1)
    const response2 = await drawCardWithTracking(1)

    blackjackStore.playerHit(response1.data.cards[0]) // Add to current hand

    // Switch to second hand and add card
    blackjackStore.nextHand()
    blackjackStore.playerHit(response2.data.cards[0])

    // Go back to first hand
    blackjackStore.currentHandIndex = 0
  } catch (error) {
    console.error('Error splitting:', error)
  }
}

const checkNextHand = async () => {
  if (blackjackStore.nextHand()) {
    // Continue with next hand
    return
  } else {
    // All hands complete, dealer plays
    await dealerPlay()
  }
}

const dealerPlay = async () => {
  try {
    // First, flip the dealer's hole card (second card) face up
    blackjackStore.revealDealerCard(1)
    await new Promise(resolve => setTimeout(resolve, 800))

    // Now draw additional cards if needed
    while (calculateHandValue(blackjackStore.dealerHand) < 17) {
      // Add delay before drawing next card
      await new Promise(resolve => setTimeout(resolve, 1200))

      const response = await drawCardWithTracking(1)
      const card = response.data.cards[0]

      // Add card face down first
      blackjackStore.dealerHit(card)
      await new Promise(resolve => setTimeout(resolve, 400))

      // Then flip it face up
      blackjackStore.revealDealerCard(blackjackStore.dealerHand.length - 1)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Reveal all cards at the end
    blackjackStore.revealAllDealerCards()

    const dealerVal = calculateHandValue(blackjackStore.dealerHand)
    const dealerBlackjack = dealerVal === 21 && blackjackStore.dealerHand.length === 2

    blackjackStore.endGame(dealerBlackjack, dealerVal > 21)
  } catch (error) {
    console.error('Error in dealer play:', error)
  }
}

const checkDeckAndReshuffle = async () => {
  // Check if we've drawn more than 25% of the cards (78 cards out of 312)
  if (cardsDrawn.value >= 78) {
    try {
      // Return all cards and shuffle
      await deckOfCardsAPI.returnCard(deckId.value)
      await deckOfCardsAPI.shuffle(deckId.value)
      cardsDrawn.value = 0
      console.log('Deck reshuffled')
    } catch (error) {
      console.error('Error reshuffling deck:', error)
    }
  }
}

const drawCardWithTracking = async (count = 1) => {
  await checkDeckAndReshuffle()
  const response = await deckOfCardsAPI.drawCard(deckId.value, count)
  cardsDrawn.value += count
  return response
}

const newGame = () => {
  blackjackStore.resetGame()
}

onMounted(async () => {
  gameStore.updatePageTitle(pageTitle)
  blackjackStore.resetGame()

  try {
    // Create a new deck with 6 decks for blackjack
    const response = await deckOfCardsAPI.createDeck(6)
    deckId.value = response.data.deck_id
    cardsDrawn.value = 0
  } catch (error) {
    console.error('Error creating deck:', error)
  }
})
</script>

<style scoped>
#blackjack {
  height: calc(100vh - 4rem);
  display: flex;
}

aside {
  width: 15vw;
  background-color: rgb(116, 177, 116);
  border-radius: 0px 10px 10px 0px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-info p {
  margin: 5px 0;
  font-weight: bold;
}

.betting-controls,
.game-controls,
.new-game-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bet-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

button {
  background-color: rgb(84, 134, 84);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background-color: rgb(116, 177, 116);
}

button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.deal-button,
.new-game-button {
  background-color: rgb(200, 100, 100);
  font-weight: bold;
}

.deal-button:hover:not(:disabled),
.new-game-button:hover {
  background-color: rgb(220, 120, 120);
}

main {
  width: 85vw;
  padding: 20px;
  background: linear-gradient(135deg, #0f4c3a, #1a5c4a);
  min-height: calc(100vh - 4rem);
}

.game-area {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.dealer-section,
.player-section {
  text-align: center;
}

.player-hand {
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.current-hand {
  color: #ffeb3b;
  text-shadow: 0 0 10px rgba(255, 235, 59, 0.5);
}

.hand {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
  height: 140px;
  align-items: center;
}

.hand .card {
  width: 90px;
  height: 130px;
  flex-shrink: 0;
}

.game-message {
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 400px;
}

@media only screen and (max-width: 1100px) {
  #blackjack {
    flex-direction: column;
  }

  aside {
    width: 100vw;
    height: auto;
    flex-direction: row;
    justify-content: space-around;
    border-radius: 0;
  }

  main {
    width: 100vw;
  }

  .betting-controls,
  .game-controls,
  .new-game-controls {
    flex-direction: row;
    align-items: center;
  }

  .bet-buttons {
    flex-direction: row;
  }
}

@media only screen and (max-width: 600px) {
  .hand {
    gap: 5px;
    height: 100px;
  }

  .hand .card {
    width: 65px;
    height: 90px;
  }

  aside {
    flex-direction: column;
    padding: 10px;
  }

  .betting-controls,
  .game-controls,
  .new-game-controls {
    flex-direction: column;
  }

  .bet-buttons {
    flex-direction: column;
  }
}
</style>

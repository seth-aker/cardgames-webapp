<template>
  <div id="blackjack" class="h-[calc(100vh-4rem)] flex">
    <aside class="w-15vw bg-green-500 rounded-r-10 p-5 flex flex-col gap-5">
      <h2>Blackjack</h2>
      <div class="game-info">
        <p class="m-1.25 font-bold">Chips: ${{ blackjackStore.chips }}</p>
        <p class="m-1.25 font-bold">Bet: ${{ blackjackStore.currentBet }}</p>
        <p class="m-1.25 font-bold">Wins: {{ blackjackStore.wins }}</p>
        <p class="m-1.25 font-bold">Losses: {{ blackjackStore.losses }}</p>
      </div>
      <div class="betting-controls flex flex-col gap-2.5" v-if="blackjackStore.gamePhase === 'betting'">
        <h3>Place Your Bet</h3>
        <div class="bet-buttons flex flex-col gap-1.25">
          <button @click="placeBet(5)" :disabled="blackjackStore.chips < 5"
            class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">$5</button>
          <button @click="placeBet(10)" :disabled="blackjackStore.chips < 10"
            class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">$10</button>
          <button @click="placeBet(25)" :disabled="blackjackStore.chips < 25"
            class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">$25</button>
          <button @click="placeBet(50)" :disabled="blackjackStore.chips < 50"
            class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">$50</button>
        </div>
        <button @click="dealCards" :disabled="blackjackStore.currentBet === 0"
          class="deal-button bg-red-600 font-bold">Deal Cards</button>
      </div>
      <div class="game-controls flex flex-col gap-2.5" v-if="blackjackStore.gamePhase === 'playing'">
        <button @click="hit" :disabled="blackjackStore.playerBusted[blackjackStore.currentHandIndex]"
          class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">Hit</button>
        <button @click="stand"
          class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">Stand</button>
        <button @click="doubleDown" v-if="blackjackStore.canDoubleDown"
          class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">Double Down</button>
        <button @click="split" v-if="blackjackStore.canSplit"
          class="bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer text-sm">Split</button>
      </div>
      <div class="new-game-controls flex flex-col gap-2.5" v-if="blackjackStore.gamePhase === 'gameOver'">
        <button @click="newGame" class="new-game-button bg-red-600 font-bold">New Game</button>
      </div>
    </aside>
    <main class="w-85vw p-5 min-h-[calc(100vh-4rem)]" style="background: linear-gradient(135deg, #0f4c3a, #1a5c4a);">
      <div class="game-area h-full flex flex-col justify-around">
        <div class="dealer-section text-center">
          <h3>Dealer ({{ dealerHandValue }})</h3>
          <div class="hand flex justify-center gap-2.5 m-5 flex-wrap h-140 items-center">
            <playing-card v-for="(card, index) in blackjackStore.dealerHand" :key="`dealer-${card.code}`"
              :imageUrl="shouldShowDealerCard(index) ? card.image : cardBackUrl" :cardName="card.code"
              :isFlipped="shouldShowDealerCard(index)" :disabled="true" />
          </div>
        </div>

        <div class="player-section">
          <div v-for="(hand, handIndex) in blackjackStore.playerHands" :key="`hand-${handIndex}`"
            class="player-hand m-2.5 p-2.5 rounded-8 transition-colors">
            <h3 :class="{ 'current-hand': handIndex === blackjackStore.currentHandIndex }">
              Hand {{ handIndex + 1 }} ({{ getHandValue(hand) }})
              <span v-if="blackjackStore.isSplit"> - ${{ blackjackStore.handBets[handIndex] }}</span>
            </h3>
            <div class="hand flex justify-center gap-2.5 m-5 flex-wrap h-140 items-center">
              <playing-card v-for="card in hand" :key="`player-${handIndex}-${card.code}`" :imageUrl="card.image"
                :cardName="card.code" :isFlipped="true" :disabled="true" />
            </div>
          </div>
        </div>

        <div class="game-message text-center text-white bg-black bg-opacity-70 p-5 rounded-10 m-5 mx-auto max-w-400"
          v-if="gameMessage">
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
@import '@/assets/tailwind.css';
</style>

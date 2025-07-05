<template>
  <div id="matching" class="h-[calc(100vh-4rem)] flex">
    <aside class="w-10vw bg-green-500 rounded-r-10 p-2.5">
      <h2>Match all the cards to win!</h2>
      <span>
        <p>Moves: {{ gameStore.matchingAttempts }}</p>
      </span>
      <span>
        <p>Cards Matched : {{ gameStore.cardsMatched.length }}/24</p>
      </span>
      <span><game-timer :isGameOver="gameStore.isGameOver" /></span>
      <span>
        <button @click="gameStore.togglePause()"
          class="pause-button bg-green-700 text-white border-none rounded-5 p-2 px-4 cursor-pointer m-2.5">
          {{ gameStore.isPaused ? 'Resume' : 'Pause' }}
        </button>
      </span>
    </aside>
    <main class="grid grid-cols-8 grid-rows-3 w-90vw justify-items-center h-auto overflow-hidden"
      style="grid-template-areas: 'card0 card1 card2 card3 card4 card5 card6 card7' 'card8 card9 card10 card11 card12 card13 card14 card15' 'card16 card17 card18 card19 card20 card21 card22 card23';">
      <playing-card data-testid="playing-card" v-for="(card, index) in gameStore.cards" :key="card.code"
        :imageUrl="card.image" :cardName="card.code" :class="{ matched: isCardMatched(card.code) }"
        :style="() => { `grid-area: card${index}` }" :isFlipped="isCardFlipped(card.code)"
        :disabled="gameStore.isPaused || gameStore.cardsShowing.length >= 2" @card-clicked="handleCardClick" />
    </main>
    <display-win v-if="gameStore.isGameOver" />
    <pause-menu v-if="gameStore.isPaused && !gameStore.isGameOver" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlayingCard from '@/components/PlayingCard.vue'
import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
import GameTimer from '@/components/GameTimer.vue'
import DisplayWin from '@/components/DisplayWin.vue'
import PauseMenu from '@/components/PauseMenu.vue'
import { useGameStore } from '@/stores/gameStore.js'

const gameStore = useGameStore()

const pageTitle = 'Matching'
const deckInfo = ref({
  success: false,
  deck_id: '',
  shuffled: true,
  remaining: 0,
})

// Game logic methods
const isCardFlipped = (cardCode) => {
  return gameStore.cardsShowing.includes(cardCode)
}

const isCardMatched = (cardCode) => {
  return gameStore.cardsMatched.includes(cardCode)
}

const handleCardClick = (cardName) => {
  if (gameStore.cardsShowing.length < 2) {
    gameStore.addCardShowing(cardName)

    if (gameStore.cardsShowing.length === 2) {
      setTimeout(() => {
        checkMatching(gameStore.cardsShowing)
        gameStore.clearShowing()
      }, 750)
    }
  }
}

const checkMatching = (cardIds) => {
  try {
    if (cardIds && cardIds.length === 2) {
      if (cardIds[0].substring(0, 1) === cardIds[1].substring(0, 1)) {
        gameStore.addMatchingCards(cardIds)
      }
    }
  } catch (error) {
    console.error('Error checking card match:', error)
    gameStore.clearShowing()
  }
}

const getCards = async (deckId) => {
  const response = await deckOfCardsAPI.drawCard(deckId)
  if (response.data.remaining >= 0) {
    gameStore.addCard(response.data.cards)
    if (response.data.remaining > 0)
      getCards(deckId)
  }
}

onMounted(() => {
  gameStore.updatePageTitle(pageTitle)
  gameStore.clearMatching()

  deckOfCardsAPI.createDeck(undefined, 'AS,AC,KH,KD,3S,3C,4H,4D,5S,5C,6H,6D,7S,7C,8H,8D,9S,9C,0H,0D,JS,JC,QH,QD').then((resp) => {
    deckInfo.value = resp.data
    getCards(resp.data.deck_id)
  })
})
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>

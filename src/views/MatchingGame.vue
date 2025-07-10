<template>
  <div class="h-[calc(100vh-4rem)] flex xl:flex-row flex-col-reverse justify-between">
    <aside
      class="xl:w-40 w-full xl:h-full h-24 bg-green-500 rounded-r-xl xl:rounded-none p-2 xl:flex xl:flex-col flex flex-row xl:justify-start justify-around items-start">
      <h2 class="xl:text-base text-xs xl:p-0 p-2 flex items-center">Match all the cards to win!</h2>
      <span class="xl:p-0 p-2 flex items-center">
        <p class="xl:text-base text-xs">Moves: {{ gameStore.matchingAttempts }}</p>
      </span>
      <span class="xl:p-0 p-2 flex items-center">
        <p class="xl:text-base text-xs">Cards Matched : {{ gameStore.cardsMatched.length }}/24</p>
      </span>
      <span class="xl:p-0 p-2 flex items-center"><game-timer :isGameOver="gameStore.isGameOver" /></span>
      <span class="xl:p-0 p-2 flex items-center">
        <button @click="gameStore.togglePause()"
          class="bg-green-600 text-white border-none rounded px-4 py-2 cursor-pointer my-2 hover:bg-green-500">
          {{ gameStore.isPaused ? 'Resume' : 'Pause' }}
        </button>
      </span>
    </aside>
    <main
      class="xl:w-[calc(100vw-10rem)] w-full grid xl:grid-cols-8 xl:grid-rows-3 sm:grid-cols-6 sm:grid-rows-4 grid-cols-4 grid-rows-6 justify-items-center h-full overflow-hidden gap-1 p-2">
      <div v-for="(card, index) in gameStore.cards" :key="card.code" :class="{ 'opacity-0': isCardMatched(card.code) }"
        :style="() => { `grid-area: card${index}` }" class="w-full h-full max-w-[120px] max-h-[160px]">
        <playing-card data-testid="playing-card" :imageUrl="card.image" :cardName="card.code"
          :isFlipped="isCardFlipped(card.code)" :disabled="gameStore.isPaused || gameStore.cardsShowing.length >= 2"
          @card-clicked="handleCardClick" />
      </div>
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
/* All styles converted to Tailwind CSS classes */
</style>

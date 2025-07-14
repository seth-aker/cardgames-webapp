<template>
  <div class="h-[calc(100vh-4rem)] flex xl:flex-row flex-col-reverse justify-between">
    <aside
      class="xl:w-40 w-full xl:h-full h-24 bg-green-500 rounded-r-xl xl:rounded-none p-2 xl:flex xl:flex-col flex flex-row xl:justify-start justify-around items-start">
      <h2 class="xl:text-base text-xs xl:p-0 p-2 flex items-center">Match all the cards to win!</h2>
      <span class="xl:p-0 p-2 flex items-center">
        <p class="xl:text-base text-xs">Moves: {{ gameStore.matchingAttempts }}</p>
      </span>
      <span class="xl:p-0 p-2 flex items-center">
        <p class="xl:text-base text-xs">Cards Matched: {{ gameStore.cardsMatched.length }}/{{ gameStore.cards.length }}
        </p>
      </span>
      <span class="xl:p-0 p-2 flex items-center"><game-timer /></span>
      <span class="xl:p-0 p-2 flex items-center">
        <button @click="gameStore.togglePause()" :disabled="gameStore.gameState === 'paused'"
          class="bg-green-600 text-white border-none rounded px-4 py-2 cursor-pointer my-2 hover:bg-green-500">Pause</button>
      </span>
    </aside>
    <main class="xl:w-[calc(100vw-10rem)] grid gap-1 w-full justify-items-center h-full overflow-hidden p-2"
      :class="[{ 'xl:grid-cols-12': gameStore.difficulty === 'hard' }, { 'xl:grid-cols-8': gameStore.difficulty !== 'hard' }, { 'xl:grid-rows-4': gameStore.difficulty !== 'easy' }, { 'xl:grid-rows-3': gameStore.difficulty === 'easy' }]">
      <div v-for="(card, index) in gameStore.cards" :key="card.code" :class="{ 'opacity-0': isCardMatched(card.code) }"
        :style="() => { `grid-area: card${index}` }" class="w-full h-full max-w-[145px] max-h-[200px]">
        <playing-card data-testid="playing-card" :imageUrl="card.image" :cardName="card.code"
          :isFlipped="isCardFlipped(card.code)" :disabled="gameStore.isPaused || gameStore.cardsShowing.length >= 2"
          @card-clicked="handleCardClick" />
      </div>
    </main>
    <display-win v-if="gameStore.gameState === 'finished'" />
    <pause-menu v-if="gameStore.gameState === 'paused'" />
    <DifficultyMenu v-if="gameStore.gameState === 'not-started'" />
  </div>
</template>

<script setup>
import { onMounted, watch, } from 'vue'
import PlayingCard from '@/components/PlayingCard.vue'
import GameTimer from '@/components/GameTimer.vue'
import DisplayWin from '@/components/DisplayWin.vue'
import PauseMenu from '@/components/PauseMenu.vue'
import { useGameStore } from '@/stores/gameStore.js'
import DifficultyMenu from '../components/DifficultyMenu.vue'
import { doCardsMatch } from '../utils/doCardsMatch'

const gameStore = useGameStore()

const pageTitle = 'Matching'

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
      }, 700)
    }
  }
}

const checkMatching = (cardIds) => {
  try {
    if (cardIds && cardIds.length === 2 && doCardsMatch(cardIds[0], cardIds[1])) {
      gameStore.addMatchingCards(cardIds)
    }
  } catch (error) {
    console.error('Error checking card match:', error)
    gameStore.clearShowing()
  }
}

onMounted(() => {
  gameStore.updatePageTitle(pageTitle)
  gameStore.clearMatching()
})

watch(() => gameStore.isGameOver, () => {
  if (gameStore.isGameOver === true) {
    gameStore.gameState = 'finished'
  }
})
</script>

<style scoped>
/* All styles converted to Tailwind CSS classes */
</style>

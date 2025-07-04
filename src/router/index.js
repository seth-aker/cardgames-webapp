import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../views/MainMenu.vue'
import MatchingGame from '@/views/MatchingGame.vue'
import BlackjackGame from '@/views/BlackjackGame.vue'
import ComingSoon from '@/views/ComingSoon.vue'
const routes = [
  {
    path: '/',
    name: 'main-menu',
    component: MainMenu
  },
  {
    path: '/matching',
    name: 'matching',
    component: MatchingGame
  },
  {
    path: '/blackjack',
    name: 'blackjack',
    component: BlackjackGame
  },
  {
    path: '/coming_soon',
    name: 'coming-soon',
    component: ComingSoon
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

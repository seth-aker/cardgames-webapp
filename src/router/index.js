import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../views/MainMenu.vue'
import MatchingGame from '@/views/MatchingGame.vue'
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
    path: '/coming_soon',
    name: 'coming-soon',
    component: ComingSoon
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

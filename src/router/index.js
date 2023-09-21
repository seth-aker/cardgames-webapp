import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../views/MainMenu.vue'
import MatchingGame from '@/views/MatchingGame.vue'
import CommingSoon from '@/views/CommingSoon.vue'
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
    path: '/comming_soon',
    name: 'comming-soon',
    component: CommingSoon
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

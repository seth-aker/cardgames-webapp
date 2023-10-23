import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../views/MainMenu.vue'
import MatchingGame from '@/views/MatchingGame.vue'
import ComingSoon from '@/views/ComingSoon.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import BlackjackGame from '@/views/BlackjackGame.vue'
import { useUserStore } from '@/pinia/user'


const routes = [
  {
    path: '/',
    name: 'main-menu',
    component: MainMenu,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/matching',
    name: 'matching',
    component: MatchingGame,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/blackjack',
    name: 'blackjack',
    component: BlackjackGame,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/coming_soon',
    name: 'coming-soon',
    component: ComingSoon,
    meta: {
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const store = useUserStore();
  if(to.meta.requiresAuth && store.token === '') {
    return { name: 'login', query: { redirect: to.fullPath }  }

  } else {
    return true;
  }
})

export default router

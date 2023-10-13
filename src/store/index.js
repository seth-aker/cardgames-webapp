import { createStore } from 'vuex'
import axios from 'axios';
import Matching from './module/matching'
import Blackjack from './module/blackjack'

const currentToken = localStorage.getItem('token')
const currentUser = JSON.parse(localStorage.getItem('user'));

if (currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export default createStore({
  state: {
    token: currentToken || '',
    user: currentUser || {},
    pageTitle: "Let's Play Some Card Games!",
    gameTime: '',
    
  },
  getters: {
    
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGOUT(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = '';
      state.user = {};
      axios.defaults.headers.common = {};
    },
    UPDATE_PAGE_TITLE(state, pageTitle) {
      state.pageTitle = `Let's Play Some ${pageTitle}!`;
    },
    LOG_TIME(state, time){
      state.gameTime = time;
    },
    CLEAR_GAME_TIME(state) {
      state.gameTime = ''
    }
  },
  actions: {
  },
  modules: {
    m: Matching,
    bj: Blackjack
  }
})

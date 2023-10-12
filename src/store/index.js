import { createStore } from 'vuex'
import axios from 'axios';
import Matching from './module/matching'

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
    UPDATE_PAGE_TITLE(state, pageTitle) {
      state.pageTitle = `Let's Play Some ${pageTitle}!`;
    },
    LOG_TIME(state, time){
      state.gameTime = time;
    },
  },
  actions: {
  },
  modules: {
    m: Matching
  }
})

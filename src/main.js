import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars);

const pinia = createPinia();

axios.defaults.baseURL = process.env.VUE_APP_REMOTE_API;

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(pinia).use(router).mount('#app')

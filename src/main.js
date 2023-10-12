import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars);

axios.defaults.baseURL = process.env.VUE_APP_REMOTE_API;

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router).mount('#app')

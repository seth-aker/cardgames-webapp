import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: '',
        user: null,
    }),
    getters: {
        isLoggedIn: (state) => {
            return state.user !== null
        }
    },
    actions: {
        setAuthToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            if(token != null) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        },
        setUser(user) {
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));

        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.token = '';
            this.user = null;
            axios.defaults.headers.common = {};
        }
    }
})
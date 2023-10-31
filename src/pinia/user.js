import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: localStorage.getItem('token') | null,
        user: localStorage.getItem('user') | null,
    }),
    getters: {
        isLoggedIn: (state) => {
            return state.user !== 0;
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
            this.user = 0;
            axios.defaults.headers.common = {};
        }
    }
})
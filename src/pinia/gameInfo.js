import { defineStore } from "pinia";

export const useGameInfoStore = defineStore('gameInfoStore', {
    state: () => ({
        pageTitle: "Let's Play Some Card Games!",
        gameTime: ''
    }),
})
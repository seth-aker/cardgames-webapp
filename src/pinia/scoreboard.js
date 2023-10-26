import { defineStore } from "pinia";

export const useScoreboardStore = defineStore('scoreboardStore', {
    state: () => ({
        blackjackScores: [],
        matchingScores: [],
        heartsScores: [],
    })
})
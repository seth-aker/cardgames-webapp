import { defineStore } from "pinia";

export const useScoreboardStore = defineStore('scoreboardStore', {
    state: () => ({
        blackjackScores: [],
        userBjScores: [],
        matchingScores: [],
        userMatchingScores: [],
        heartsScores: [],
        userHeartsScores: []
    })
})
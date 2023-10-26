import axios from "axios";

export default {
    getBlackjackScores() {
        return axios.get("/scoreboard/blackjack");
    },
    getMatchingScores() {
        return axios.get("/scoreboard/matching");
    }
}
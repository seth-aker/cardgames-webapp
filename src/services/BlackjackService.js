import axios from "axios";

export default {
    newGame() {
        return axios.get('/blackjack/new_game');
    },
    drawCard(deckId, number) {
        return axios.get(`/blackjack/${deckId}/draw?count=${number}`)
    },
    saveFinalStats(gameSession) {
        return axios.post(`/blackjack/save_stats`, gameSession)
    }
}
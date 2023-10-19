import axios from "axios";

export default {
    newGame() {
        return axios.get('/blackjack/new_game')
    },
    drawCard(deckId, number) {
        return axios.get(`/blackjack/${deckId}/draw?count=${number}`)
    },

    newRound(deckId, gameSession) {
        return axios.put(`/blackjack/${deckId}`, gameSession)
    },
    
    saveFinalStats(gameSession) {
        return axios.post(`/blackjack/save_stats`, gameSession)
    }
}
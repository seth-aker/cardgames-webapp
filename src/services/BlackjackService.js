import axios from "axios";

export default {
    newGame() {
        return axios('/blackjack/new_game', {
            method: 'GET',
            mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
     credentials: 'same-origin',

        });
    },
    drawCard(deckId, number) {
        return axios.get(`/blackjack/${deckId}/draw?count=${number}`)
    },
    saveFinalStats(gameSession) {
        return axios.post(`/blackjack/save_stats`, gameSession)
    }
}
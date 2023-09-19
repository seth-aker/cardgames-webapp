import axios from "axios";

const http = axios.create({
    baseURL: "https://www.deckofcardsapi.com/api/deck"
});

export default {
    createDeck() {
        return http.get('/new/shuffle/?deck_count=1');
    },
    drawCards(deckId) {
        return http.get(`/${deckId}/draw/?count=1`);
    }
}
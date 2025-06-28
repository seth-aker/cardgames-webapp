import axios from "axios";

const http = axios.create({
    baseURL: "https://www.deckofcardsapi.com/api/deck"
});

export default {
    createDeck(cards = null) {
        let url = '/new/shuffle/';
        if (cards) {
            url += `?cards=${cards}`;
        } else {
            url += '?deck_count=1';
        }
        return http.get(url);
    },
    shuffle(deckId) {
        return http.get(`/${deckId}/shuffle/`);
    },
    drawCard(deckId, count = 1) {
        return http.get(`/${deckId}/draw/?count=${count}`);
    },
    returnCard(deckId, cards) {
        if (!cards) {
            throw new Error('Cards parameter is required for returning cards.');
        }
        return http.get(`/${deckId}/return/?cards=${cards}`);
    }
}

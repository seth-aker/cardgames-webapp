import axios from "axios";

const http = axios.create({
    baseURL: "https://www.deckofcardsapi.com/api/deck"
});

export default {
    createDeck(deckCount = 1, cards = null) {
        let url = '/new/shuffle/'
        if (cards) {
            url = url + `?cards=${cards}`
        } else {
            url = url + `?deck_count=${deckCount}`
        }
        return http.get(url);
    },
    drawCard(deckId, count = 1) {
        return http.get(`/${deckId}/draw/?count=${count}`);
    },
    shuffle(deckId, remaining = false) {
        if (!deckId) throw new Error("Deck id required");
        let url = `/${deckId}/shuffle/`
        if (remaining) {
            url = url + '?remaining=true'
        }
        return http.get(url);
    },
    returnCard(deckId, cards = null) {
        if (!deckId) throw new Error("Deck id required");
        let url = `/${deckId}/return`
        if (cards) {
            url = url + `/?cards=${cards}`
        }
        return http.get(url)
    }
}

import axios from "axios";

const http = axios.create({
    baseURL: "https://www.deckofcardsapi.com/api/deck"
});

export default {
    // Create a new deck with optional card specification
    createDeck(cards = null) {
        const cardsParam = cards ? `?cards=${cards}` : '';
        return http.get(`/new${cardsParam}`);
    },

    // Create a matching deck (backward compatibility)
    createMatchingDeck() {
        const matchingCards = 'AS,AC,KH,KD,3S,3C,4H,4D,5S,5C,6H,6D,7S,7C,8H,8D,9S,9C,0H,0D,JS,JC,QH,QD';
        return this.createDeck(matchingCards).then(response => {
            // Automatically shuffle the matching deck
            return this.shuffle(response.data.deck_id).then(() => response);
        });
    },

    // Shuffle an existing deck
    shuffle(deckId) {
        return http.get(`/${deckId}/shuffle/`);
    },

    // Draw a single card from deck
    drawCard(deckId) {
        return http.get(`/${deckId}/draw/?count=1`);
    },

    // Draw multiple cards from deck (existing function for compatibility)
    drawCards(deckId, count = 1) {
        return http.get(`/${deckId}/draw/?count=${count}`);
    },

    // Return cards to deck
    returnCard(deckId, cards) {
        const cardCodes = Array.isArray(cards) ? cards.join(',') : cards;
        return http.get(`/${deckId}/return/?cards=${cardCodes}`);
    }
}

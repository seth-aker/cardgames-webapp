import axios from "axios";

const http = axios.create({
    baseURL: "https://www.deckofcardsapi.com/api/deck"
});

export default {
    createMatchingDeck() {
        return http.get('/new/shuffle/?cards=AS,AC,KH,KD,3S,3C,4H,4D,5S,5C,6H,6D,7S,7C,8H,8D,9S,9C,0H,0D,JS,JC,QH,QD');
    },
    drawCards(deckId, num) {
        return http.get(`/${deckId}/draw/?count=${num}`);
    } 
}
import BlackjackService from "@/services/BlackjackService";

const dealRound = async (deckId) => {
    let error = null;
    let response = {};

    try {
        response = await BlackjackService.drawCard(deckId, 4).data;
    } catch(err) {
        error = err.message;
        console.error(err);
    }

    return {response, error}
}
export default dealRound;
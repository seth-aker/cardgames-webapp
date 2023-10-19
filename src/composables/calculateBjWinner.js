import { useBlackjackStore } from "../pinia/blackjack"
const bjStore = useBlackjackStore();

/**
 * @returns String: PUSH, DEALER, PLAYER
 */
const calculateWinner = () => {
    const pHandTotal = bjStore.playerHandTotal;
    const dHandTotal = bjStore.dealerHandTotal;
    let result;
    if (pHandTotal > 21) {
        result = "DEALER";
        return { result };
    }
    if (dHandTotal === 21) {
        if( pHandTotal === 21) {
            result = "PUSH";
        } else {
            result = "DEALER";
        }
        return { result };
    }
    if (pHandTotal === dHandTotal ) {
        result = "PUSH";
    }
    if (pHandTotal < dHandTotal) {
        result = "DEALER";
    }
    
}
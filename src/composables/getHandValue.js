

const getHandValue = (hand) => {
    //number of aces in the players hand
    let aceCount = hand.filter(card => {
        return card.value === 'ACE'
    }).length

    //sums the value of the cards in a players hand
    let handSum = hand.reduce((total, card) => {
        let cardValue;
        switch (card.value) {
            case 'ACE': 
                cardValue = 11;
                break;
            case 'JACK': 
            case 'QUEEN': 
            case 'KING': 
                cardValue = 10
                break;
            default: cardValue = Number(card.value)
                break;
        } 
        return total + cardValue;
    }, 0);
    if(handSum <= 21) {
        return handSum;
    }
    //All aces in a hand are initially set to 11. 
    //If handSum is > 21, will set the value of one ace to 1. 
    //Loop continues until hand no longer has aces or handSum is <= 21; 
    while(handSum > 21 && aceCount > 0) {
        handSum -= 10;
        aceCount--;
    }
    return handSum;
}

export default getHandValue;
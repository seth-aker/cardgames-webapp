import getHandValue from "./getHandValue";

const checkForNaturals = (hand) => {
    const value = getHandValue(hand);
    let isNatural = false;
    if(value === 21) {
        isNatural = true;
    }

    return isNatural;
}

export default checkForNaturals;
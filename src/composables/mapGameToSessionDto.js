
const mapGameToSessionDto = (bjStore, infoStore) => {
    
    const sessionDTO = bjStore.sessionDTO;
    sessionDTO.deck.cards = bjStore.player.hand.concat(bjStore.dealer.hand);
   
    sessionDTO.player_money = bjStore.player.wallet;
    sessionDTO.round++;
    sessionDTO.time_seconds = infoStore.gameTimeSec;

    return sessionDTO 
};

export default mapGameToSessionDto;
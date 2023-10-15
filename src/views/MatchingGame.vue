<template>
  <div id="matching">
      <aside>
        <h2>Match all the cards to win!</h2>
        <span><p>Moves: {{matchStore.matchingAttempts}}</p></span>
        <span><p>Cards Matched : {{ matchStore.cardsMatched.length }}/24</p></span>
        <span><game-timer :isGameOver="matchStore.isGameOver" /></span>
      </aside>
      <main>
        <matching-card v-for="(card, index) in matchStore.cards" :key="card.code" :imageUrl="card.image" :cardName="card.code" :class="`card${index}`"/>
      </main>
      <display-win v-show="matchStore.isGameOver" /> 
  </div>
</template>

<script>
import MatchingCard from '@/components/Matching/MatchingCard.vue';
import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
import GameTimer from '@/components/GameTimer.vue';
import DisplayWin from '@/components/DisplayWin.vue';
import { useMatchingStore } from '@/pinia/matching';
import { useGameInfoStore } from '@/pinia/gameInfo';
import { ref } from 'vue';


export default {
  name: "matching-game",
  setup() {
    const matchStore = useMatchingStore();
    matchStore.$reset();
    const store = useGameInfoStore();
    store.pageTitle = "Let's Play Memory Matching!"
    const error = ref(null);

    //begins the async calls to get the cards. Uses function below 'getCards'
    const getDeck = async () => {
      try {
        const response = await deckOfCardsAPI.createMatchingDeck();
        if(!response.status === 200) {
          throw Error("Failed to connect to deckofcardsapi.com")
        }
        getCards(response.data.deck_id)
      } catch (err) {
        error.value = err.message
      }
      
    }

    //runs until all the cards from the deck have been drawn.
    const getCards = async (deckId) => {
      try {
        const response = await deckOfCardsAPI.drawCards(deckId)
        if(!response.status === 200) {
          throw Error("Try again")
        }
        if(response.data.remaining >= 0) {
          matchStore.addCards(response.data.cards)
          if(response.data.remaining > 0)
            getCards(deckId);
        }
      } catch(err) {
        getCards(deckId)
      }
    }

    
    getDeck();
    return { matchStore, error}
  },
  
  components: { MatchingCard, GameTimer, DisplayWin },
}
</script>

<style scoped>
  #matching{
    height: calc(100vh - 4rem);
    display: flex;
  }

  aside{
    width: 10vw;
    background-color:  rgb(116, 177, 116);
    border-radius: 0px 10px 10px 0px;
    padding: 10px;
  }

  main{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr ;
    grid-template-areas: "card0 card1 card2 card3 card4 card5 card6 card7"
                         "card8 card9 card10 card11 card12 card13 card14 card15"
                         "card16 card17 card18 card19 card20 card21 card22 card23";
    width: 90vw;
    justify-items: center;
    height: -webkit-fill-available;
    overflow: hidden;
  }

  .displayNone {
    display: none; 
  }
  
  @media only screen and (max-width: 1100px) {
    #matching {
      flex-direction: column-reverse;
      justify-content: space-between;
     
    }
    main{
      width: 100vw;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-template-areas:  "card0 card1 card2 card3 card4 card5"
                            "card6 card7 card8 card9 card10 card11"
                            "card12 card13 card14 card15 card16 card17"
                            "card18 card19 card20 card21 card22 card23"
    }
    aside {
      height: 12vh;
      display: flex;
      align-content: flex-start;
      width: 100vw;
    }

    aside span, aside h2 {
      padding: 10px;
      display: flex;
      align-items: center;
    }
    h2{
      font-size: 12px;
    }
    p{
      font-size: 10px;
    }
  }

  @media only screen and (max-width: 600px){
    
    main{
      width: 100vw;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-areas:    "card0 card1 card2 card3"
                              "card4 card5 card6 card7"
                              "card8 card9 card10 card11"
                              "card12 card13 card14 card15"
                              "card16 card17 card18 card19"
                              "card20 card21 card22 card23"
    }

    aside {
      height: 9vh;
    }

  }

</style>
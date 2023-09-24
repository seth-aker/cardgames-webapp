<template>
  <div id="matching">
      <aside>
        <h2>Match all the cards to win!</h2>
        <span><p>Moves: {{$store.state.matchingAttempts}}</p></span>
        <span><p>Cards Matched : {{ $store.state.cardsMatched.length }}/24</p></span>
        <span><game-timer :isGameOver="isGameOver" /></span>
      </aside>
      <main>
        <playing-card v-for="(card, index) in cards" :key="card.code" :imageUrl="card.image" :cardName="card.code" :class="`card${index}`"/>
      </main>
      <display-win v-show="isGameOver" /> 
  </div>
</template>

<script>
import PlayingCard from '@/components/PlayingCard.vue';
import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
import GameTimer from '@/components/GameTimer.vue';
import DisplayWin from '@/components/DisplayWin.vue';
export default {
  name: "matching-game",
  components: { PlayingCard, GameTimer, DisplayWin },
  data() {
    return {
      pageTitle: 'Matching',
      deckInfo: {
        success: false,
        deck_id: '',
        shuffled: true,
        remaining: '',
      },
    }
  },

  created() {
    this.$store.commit('UPDATE_PAGE_TITLE', this.pageTitle);
    this.$store.commit('CLEAR_MATCHING');
    deckOfCardsAPI.createMatchingDeck().then((resp) => {
      this.deckInfo = resp.data;
      for(let i = 0; i < 24; i++ ) {
        deckOfCardsAPI.drawCards(resp.data.deck_id).then(response => {
        response.data.cards.forEach((card) => {
          this.$store.commit("ADD_CARD", card);
        });
      })
      } 
    });
    
  },
  computed: {
    cards() {
      return this.$store.state.cards;
    },
    isGameOver() {
      return this.$store.getters.isGameOver;
    },
  }
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
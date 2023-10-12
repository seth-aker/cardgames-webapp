<template>
  <div id="matching">
      <aside>
        <h2>Match all the cards to win!</h2>
        <span><p>Moves: {{$store.state.m.matchingAttempts}}</p></span>
        <span><p>Cards Matched : {{ $store.state.m.cardsMatched.length }}/24</p></span>
        <span><game-timer :isGameOver="isGameOver" /></span>
      </aside>
      <main>
        <matching-card v-for="(card, index) in cards" :key="card.code" :imageUrl="card.image" :cardName="card.code" :class="`card${index}`"/>
      </main>
      <display-win v-show="isGameOver" /> 
  </div>
</template>

<script>
import MatchingCard from '@/components/MatchingCard.vue';
import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
import GameTimer from '@/components/GameTimer.vue';
import DisplayWin from '@/components/DisplayWin.vue';
export default {
  name: "matching-game",
  components: { MatchingCard, GameTimer, DisplayWin },
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
  methods: {
    async getCards(deckId) {
      const response = await deckOfCardsAPI.drawCards(deckId)
      if(response.data.remaining >= 0) {
        this.$store.commit("m/ADD_CARD_MATCHING", response.data.cards)
        if(response.data.remaining > 0)
          this.getCards(deckId);
      }
    }
  },

  created() {
    this.$store.commit('UPDATE_PAGE_TITLE', this.pageTitle);
    this.$store.commit('m/CLEAR_MATCHING');
   
    deckOfCardsAPI.createMatchingDeck().then((resp) => {
      this.deckInfo = resp.data;
      this.getCards(resp.data.deck_id);
    })
  }, 
  computed: {
    cards() {
      return this.$store.state.m.cards;
    },
    isGameOver() {
      return this.$store.getters['m/isMatchingOver'];
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
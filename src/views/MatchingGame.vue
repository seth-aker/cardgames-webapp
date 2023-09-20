<template>
  <div id="matching">
      <aside>
        <h2>Match all the cards to win!</h2>
        <span><p>Turn Count: {{attempts}}</p></span>
      </aside>
      <main>
        <playing-card v-for="(card, index) in cards" :key="index" :imageUrl="card.image" :cardName="card.code" :class="`card${index}`"/>
      </main>
  </div>
</template>

<script>
import PlayingCard from '@/components/PlayingCard.vue';
import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
export default {
  name: "matching-game",
  components: { PlayingCard },
  data() {
    return {
      attempts: 0,
      deckInfo: {
        success: false,
        deck_id: '',
        shuffled: true,
        remaining: '',
      },
      
    }
  },

  methods: {
    attempt() {
      this.attempts++;
    }
  },
  created() {
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
    }
  }
}
</script>

<style scoped>
  #matching{
    height: calc(100vh - 4rem);
    display: flex;
  }

  aside{
    width: 300px;
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
  }

  .matched {
    opacity: 0;
  }

</style>
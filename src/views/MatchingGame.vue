<template>
  <div id="matching">
      <aside>
        <h2>Match all the cards to win!</h2>
        <span><p>Turn Count: {{attempts}}</p></span>
      </aside>
      <main>
        <playing-card v-for="(card, index) in cards" :key="index" :imageUrl="card.image" :cardName="card.code"/>
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
      cards: []
    }
  },

  methods: {
    attempt() {
      this.attempts++;
    }
  },
  created() {
   deckOfCardsAPI.createDeck().then((resp) => {
      this.deckInfo = resp.data;
      deckOfCardsAPI.drawCards(resp.data.deck_id, 21).then(response => {
        response.data.cards.forEach(card => {
          this.cards.push(card);
        });
      })
    });
    
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
  }

  main{
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    flex-basis: 100%;
  }



</style>
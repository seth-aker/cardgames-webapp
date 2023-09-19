<template>
  <div id="matching">
      <aside>
        <h2>Match all the cards to win!</h2>
        <span><p>Turn Count: {{attempts}}</p></span>
      </aside>
      <main>
        <playing-card v-for="card in cards" :key="card.code" :card="card"/>
      </main>
  </div>
</template>

<script>
import PlayingCard from '@/components/PlayingCard.vue';
// import deckOfCardsAPI from '@/services/deckOfCardsAPI.js'
export default {
  components: { PlayingCard },
  data() {
    return {
      attempts: 0,
      deck: [],
      cards: [
        {
          code: 1,
          url: 'https://www.deckofcardsapi.com/static/img/back.png'
        },
        {
          code: 2,
          url: 'https://www.deckofcardsapi.com/static/img/back.png'
        },
        {
          code: 3,
          url: 'https://www.deckofcardsapi.com/static/img/back.png'
        },
        {
          code: 4,
          url: 'https://www.deckofcardsapi.com/static/img/back.png'
        },
        {
          code: 5,
          url: 'https://www.deckofcardsapi.com/static/img/back.png'
        },
        {
          code: 6,
          url: 'https://www.deckofcardsapi.com/static/img/back.png'
        }
        // {
        //   code: 7,
        //   url: 'https://www.deckofcardsapi.com/static/img/back.png'
        // },
        // {
        //   code: 8,
        //   url: 'https://www.deckofcardsapi.com/static/img/back.png'
        // },
        // {
        //   code: 9,
        //   url: 'https://www.deckofcardsapi.com/static/img/back.png'
        // }
      ]
    }
  },

  methods: {
    attempt() {
      this.attempts++;
    }
  },
  // create(){
  //   deckOfCardsAPI.createDeck().then(resp => {
  //     this.deckInfo = resp.data;
  //     deckOfCardsAPI.drawCards(this.deckInfo.deck_id, )
  //   })
  // }
}
</script>

<style>

</style>
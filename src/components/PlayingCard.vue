<template>
<div class="card" @click="flipCard" :class="{show: showCard}">
    <div class="card-inner">
        <div class="card-back" >
            <img :src="cardbackURL" alt="card-back">
        </div>
        <div class="card-face" >
            <img :src="imageUrl" :alt="cardName">
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['imageUrl', 'cardName'],
    
    data() {
        return {
            cardbackURL:'https://www.deckofcardsapi.com/static/img/back.png'
            
        }
    },
    methods: {
        flipCard() {
            if(this.showCard === false && this.$store.state.cardsShowing.length < 2) {
            this.$store.commit('ADD_CARD_SHOWING', this.cardName)
            } 

            if(this.$store.state.cardsShowing.length >= 2 ){
                setTimeout(function() {
                    this.$store.commit('CLEAR_SHOWING')
                }, 1000);
            }
        }
    },
    computed: {
        showCard() {
             return this.$store.state.cardsShowing.includes(this.cardName) ? true : false      
        }
    }
     
}
</script>

<style scoped>

img{
    width: 10vw;
}
.card{
    background-color: transparent;
    width: 10vw;
    height: 30%;
    perspective: 1000px;
    margin: 0.5rem
}
.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.show .card-inner {
    transform: rotateY(180deg)
}

.card-back, .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

.card-face {
    transform: rotateY(180deg)
}

.card0 {
    grid-area: card0;
}
.card1 {
    grid-area: card1;
}
.card2 {
    grid-area: card2;
}
.card3 {
    grid-area: card3;
}
.card4 {
    grid-area: card4;
}
.card5 {
    grid-area: card5;
}
.card6 {
    grid-area: card6;
}
.card7 {
    grid-area: card7;
}
.card8 {
    grid-area: card8;
}
.card9 {
    grid-area: card9;
}
.card10 {
    grid-area: card10;
}
.card11 {
    grid-area: card11;
}
.card12 {
    grid-area: card12;
}
.card13 {
    grid-area: card13;
}
.card14 {
    grid-area: card14;
}
.card15 {
    grid-area: card15;
}
.card16 {
    grid-area: card16;
}
.card17 {
    grid-area: card17;
}
.card18 {
    grid-area: card18;
}
.card19 {
    grid-area: card19;
}
.card20 {
    grid-area: card20;
}
.card21 {
    grid-area: card21;
}
.card22 {
    grid-area: card22;
}
.card23 {
    grid-area: card23;
}


</style>
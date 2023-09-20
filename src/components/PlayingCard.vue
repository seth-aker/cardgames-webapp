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
            cardbackURL:'https://www.deckofcardsapi.com/static/img/back.png',
            showCard: false
        }
    },
    methods: {
        flipCard() {
            this.showCard = !this.showCard;
        }
    }
}
</script>

<style scoped>

img{
    width: 200px;
}
.card{
    background-color: transparent;
    width: 10vw;
    height: 200px;
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
    backface-visibility: hidden;
}

.card-face {
    transform: rotateY(180deg)
}


</style>
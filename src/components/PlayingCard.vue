<template>
    <div class="card" @click="flipCard" :class="{ show: showCard, matched: matched }" data-testid="playing-card">
        <div class="card-inner">
            <div class="card-back">
                <img :src="cardbackURL" alt="card-back">
            </div>
            <div class="card-face">
                <img :src="imageUrl" :alt="cardName">
            </div>
        </div>
    </div>
</template>

<script>
import { useGameStore } from '@/stores/gameStore.js';

export default {
    props: ['imageUrl', 'cardName'],
    setup() {
        const gameStore = useGameStore();
        return { gameStore };
    },
    data() {
        return {
            cardbackURL: 'https://www.deckofcardsapi.com/static/img/back.png',

        }
    },
    methods: {
        flipCard() {
            if (this.showCard === false && this.gameStore.cardsShowing.length < 2) {
                this.gameStore.addCardShowing(this.cardName)
            }

            if (this.gameStore.cardsShowing.length >= 2) {
                setTimeout(() => {
                    this.checkMatching(this.gameStore.cardsShowing);
                    this.gameStore.clearShowing();
                }, 750);

            }
        },

        checkMatching(cardIds) {
            try {
                if (cardIds !== undefined) {
                    if (cardIds[0].substring(0, 1) === cardIds[1].substring(0, 1)) {
                        this.gameStore.addMatchingCards(cardIds)
                    }
                }
            } catch (error) {
                this.gameStore.clearShowing();
            }
        },

    },
    computed: {
        showCard() {
            return this.gameStore.cardsShowing.includes(this.cardName) ? true : false
        },
        matched() {
            return this.gameStore.cardsMatched.includes(this.cardName) ? true : false
        }
    }
}
</script>

<style scoped>
img {
    height: 90%;
}

.card {
    background-color: transparent;
    width: 100%;
    perspective: 1000px;
    margin: 0.5rem
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    -webkit-transition: all 0.8s;
    -moz-transition: all 0.8s;
    -ms-transition: all 0.8s;
    -o-transition: all 0.8s;
    transition: all 0.8s;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;

}

.show .card-inner {
    -moz-transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -o-transform: rotateY(180deg);
    -ms-transform: rotateY(180deg);
    transform: rotateY(180deg);

}

.card-back,
.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
}

.card-face {
    -moz-transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -o-transform: rotateY(180deg);
    -ms-transform: rotateY(180deg);
    transform: rotateY(180deg);

}

.matched {
    display: none;
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

@media only screen and (max-width: 600px) {
    img {
        height: 100%;
    }
}
</style>

<template>
    <div>
        <div class="card">
            <div class="card-inner">
                <div class="card-back">
                    <img :src="card.image" :alt="card.code">
                </div>
                <div class="card-face">
                    <img :src="cardBack" alt="card-back">
                </div>
            </div>

        </div>
    </div>
</template>

<script>

export default {
    name: 'BlackjackCard',
    props: ['card'],
    data() {
        return {
            cardBack: 'https://www.deckofcardsapi.com/static/img/back.png'
        }
    }
}
</script>

<style scoped>

img{
    height: 90%;
}
.card{
    background-color: transparent;
    width: 100%;
    height: 100%;
    perspective: 1000px;
    position: absolute;
}
.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    -webkit-transition: all 0.8s ;
    -moz-transition: all 0.8s ;
    -ms-transition: all 0.8s ;
    -o-transition: all 0.8s ;
    transition: all 0.8s ;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;

}


.card-back, .card-face {
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
</style>
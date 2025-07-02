<template>
    <div class="card" @click="handleClick" :class="{ show: isFlipped }" data-testid="playing-card">
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

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    isFlipped: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['card-clicked'])

// Data
const cardbackURL = ref('https://www.deckofcardsapi.com/static/img/back.png')

// Methods
const handleClick = () => {
    if (!props.disabled && !props.isFlipped) {
        emit('card-clicked', props.cardName)
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

@media only screen and (max-width: 600px) {
    img {
        height: 100%;
    }
}
</style>

<template>
        <blackjack-card class="card-container" 
                            v-for="(card, index) in hand" 
                            :key="index" 
                            :class="{hidden: index === 0 && isDealer} " 
                            :card="card"
                            :style="{right: offset(index)}">
        </blackjack-card>
</template>

<script>
import BlackjackCard from './BlackjackCard.vue';

export default {
    name: 'card-container',
    components: {
        BlackjackCard
    },
    props: ['hand', 'isDealer'],
    methods: {
        offset(index) {
            return `${(index)*75}px`
        }
    }
}
</script>

<style scoped>
.card-container {
    position: relative;
    /* height: 200px; 
    width: 130px;  */
    width: 10vw;
    
}
</style>
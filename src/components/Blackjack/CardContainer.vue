<template>
        <div class="card-container">
            <blackjack-card class="cards" 
                                v-for="(card, index) in hand" 
                                :key="index" 
                                :class="{hidden: index === 0 && hiddenFirst} " 
                                :card="card"
                                :style="{left: offset(index)}">
            </blackjack-card>
        </div>
</template>

<script>
import BlackjackCard from './BlackjackCard.vue';

export default {
    name: 'card-container',
    components: {
        BlackjackCard
    },
    props: ['hand', 'hiddenFirst'],
    methods: {
        offset(index) {
            return `calc(35vw + ${(index)*75}px)`
        }
    }
}
</script>

<style scoped>
.card-container{
    display: flex;
    align-items: flex-start;
}
.cards {
    position: absolute;
    height: 30vh;
    width: 10vw;
    
}
</style>
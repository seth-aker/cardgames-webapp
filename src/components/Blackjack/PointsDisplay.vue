<script setup>
import { defineProps } from 'vue';
// eslint-disable-next-line no-unused-vars
const props = defineProps({
    handValue: Number,
    name: String
})
</script>

<template>
    <div class="point-display">
        <div class="points"><h1>{{ handValue }}</h1></div>
        <h1 class="name">{{ name }}</h1>
    </div>

</template>

<style scoped>
.point-display {
    display: flex;
    background-color: var(--green-background);
    border-radius: var(--default-radius);
    height: fit-content;
    align-items: center;
    padding: 5px;
    margin: 10px;
    align-self: center;
}
.points {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    background-color: var(--green-hover);
    border: solid 2px var(--green-hover-light);
    border-radius: 50px;
}

@media only screen and (max-width: 600px){
    .point-display {
        height: 5vh;
        font-size: smaller;
    }
    .points {
        height: 35px;
        width: 35px;
        border-radius: 25px;
        
    }
}
</style>


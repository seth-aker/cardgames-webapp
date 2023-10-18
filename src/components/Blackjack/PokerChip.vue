<template>
    <div class="chip">
        <h2 class="chip-value">${{ value }}</h2>
        <img :src="src" :alt="value" >
    </div>
</template>

<script>

export default {
    name: 'Poker-Chip',
    props: ['value', 'src'],
}
</script>

<style scoped>
.chip {
    margin: 15px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    
}
.chip img {
    width: 75px;
    height: 75px;
    background-color: white;
    border-radius: 50px;
    box-shadow: 1px 4px 4px black;
}

.chip:active img {
    box-shadow: 0px 1px 2px black;
}

.chip-value {
    position: relative;
    color: white;
    margin: 2px;
    padding: 0
    
    
}
</style>
<template>
    <div class="chip">
        <img :src="src" :alt="value" />
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
    width: 50px;
    height: 50px;
    margin: 0;
    padding: 0;
}
.chip svg {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: solid 2px;
   
}

p {
    position: absolute;
}
</style>
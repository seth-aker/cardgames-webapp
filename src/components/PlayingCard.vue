<template>
  <img :src="card.url" :alt="card.code">
</template>

<script>
export default {
    props: ['card']
}
</script>

<style scoped>

img{
    width: 200px;
}


</style>
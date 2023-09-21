<template>
   <header>
        <div id="left-header">
            <img src="https://www.deckofcardsapi.com/static/img/spade.svg" alt="spade-img">
            <h1> {{ this.$store.state.pageTitle }} </h1>
        </div>
        
        <nav id="links">
            <router-link :to="{name: 'matching'}" @click="$store.commit('CLEAR_MATCHING')">Matching</router-link>
            <!-- <a href="#blackjack" @click.prevent="">Blackjack</a>
            <a href="#hearts" @click.prevent="" >Hearts</a> -->
            <router-link :to="{name: 'main-menu'}">Home</router-link>
        </nav>
    </header>
</template>

<script>
export default {

}
</script>

<style scoped>
header{
    display: flex;
    color: white;
    background-color: rgb(84, 134, 84);
    top: 0;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
}

img{
   height: 80%;
   padding-left: 1vw;
}
h1 {
    padding: 0.5rem;
    font-size: 2.5rem;
}

div {
    padding: 0.5rem;
    margin-right: 2vw;
    height: 100%;
    display: flex;
    align-items: center;
}

a{
    font-size: 1.75rem;
    color: white;
    padding: 0.5rem;
    margin: 0px 10px 0px 10px;
    text-decoration: none;
    border-radius: 10px;
    border: 2px solid rgb(84, 134, 84);
}
a:hover{
    background-color: rgb(116, 177, 116);
    border: 2px rgba(255, 255, 255, 0.267) solid;
}

</style>
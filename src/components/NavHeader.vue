<template>
   <header>
        <div id="left-header">
            <img src="https://www.deckofcardsapi.com/static/img/spade.svg" alt="spade-img">
            <h1> {{ this.$store.state.pageTitle }} </h1>
        </div>
        
        <nav id="links" :class="{display: display}">
            <div id="navigation">
                <ul class="cf">
                    <li class="dropdown">
                        <h2>Games</h2>
                        <ul class="games">
                            <li class="game">
                                <router-link :to="{name: 'matching'}" @click="$store.commit('CLEAR_MATCHING'), display = false;">Matching</router-link>
                            </li>
                            <li class="game">
                                <router-link :to="{name: 'coming-soon'}" @click="display = false">Blackjack</router-link>
                            </li>
                            <li class="game">
                                <router-link :to="{name: 'coming-soon'}" @click="display = false">Hearts</router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="home">
                        <h2><router-link :to="{name: 'main-menu'}">Home</router-link></h2>
                    </li>
                </ul>
            </div>
            
        </nav>
        <font-awesome-icon icon="fa-solid fa-bars" @click="toggleMenu"/>
    </header>
</template>

<script>
export default {
    data() {
        return {
            display: false
        }
    },
    methods: {
        toggleMenu() {
            this.display = !this.display;
        }
    }
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
    overflow: hidden;
    
}

img{
   height: 80%;
   padding-left: 1vw;
}
h1 {
    padding: 0.5rem;
    font-size: 2.5rem;
}

h2{
    font-size: 1.75rem;
}

div {
    padding: 0.5rem;
    height: 100%;
    display: flex;
    align-items: center;
}

nav{
    position: absolute;
    display: flex;
    align-items: center;
    right: 50px;
    top: 0;
    height: 4rem;
    max-width: 0;
    transition: max-width 1000ms ease-in-out;
    padding: 0;
}

nav > div > ul {
    height: 4rem;
}

.dropdown {
    padding: 0 20px;
    height: 4rem;
    display: flex;
    align-items: center;
}

.dropdown:hover{
    background-color: rgb(116, 177, 116);
}
.display{
    max-width: 300px;
}
nav ul {
    display: flex;
    list-style: none;
    align-items: center;
}


nav li {
	float: left;
	margin: 0;
	position: relative;
    list-style: none;

}

nav li ul {
	float: left;
	left: 0;
	width:150%;
	opacity: 0;
	position: absolute;
	top: 3rem;
	visibility: hidden;
	z-index: 1;
    transition: 250ms ease-in-out;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.game {
    padding: 0.5rem 0;
    width: 100%;
    height: 100%;
}
.game:hover a{
    background-color: rgb(116, 177, 116);
}

li.game:hover {
    background-color: rgb(116, 177, 116);
}

nav li:hover ul {
	opacity: 1;
	top: 4rem;
	visibility: visible;
    background-color: rgb(84, 134, 84);
}



.home{
    display: flex;
    background-color: rgb(84, 134, 84);
    height: 4rem;
    align-items: center;
    padding: 0 20px;
}

.home:hover, .home:hover a{
    background-color: rgb(116, 177, 116);
    height: 4rem;
}

a {
    font-size: 1.75rem;
    color: white;
    background-color: rgb(84, 134, 84);
    padding: 0;
    margin: 0;
    text-decoration: none;
    border: none;
}


svg{
    position: relative;
    padding: 1rem 0.75rem;
    height: 2rem;
    background-color: rgb(84, 134, 84);
}

/*clearfix*/
.cf:after, .cf:before {
	content: "";
	display: table;
}
.cf:after {
	clear: both;
}

@media only screen and (max-width: 1100px) {
header {
    height: 3.5rem;
}

h1 {
    display: none;
}

nav {
    height: 3.5rem;
}

.home {
    height: 3.5rem;
}

.home:hover, .home:hover a{
    height: 3.5rem;
}

nav li:hover ul {
	top: 3.5rem;
}

.dropdown {
    height: 3.5rem;
}
}
    


</style>
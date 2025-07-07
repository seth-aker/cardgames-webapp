<template>
    <header class="flex text-white bg-green-600 top-0 justify-between items-center h-16 overflow-hidden">
        <div class="p-2 h-full flex items-center">
            <img src="https://www.deckofcardsapi.com/static/img/spade.svg" alt="spade-img" class="h-4/5 pl-4">
            <h1 class="p-2 text-4xl xl:block hidden"> {{ gameStore.pageTitle }} </h1>
        </div>

        <nav class="absolute flex items-center right-12 top-0 h-16 max-w-0 transition-all duration-1000 ease-in-out p-0"
            :class="{ display: display }">
            <div>
                <ul class="cf flex list-none items-center h-16">
                    <li class="dropdown px-5 h-16 flex items-center hover:bg-green-500 relative">
                        <h2 class="text-3xl">Games</h2>
                        <ul
                            class="games absolute left-0 w-full opacity-0 top-12 invisible z-10 transition-all duration-250 ease-in-out flex flex-col p-0 bg-green-600">
                            <li class="game py-2 w-full h-full hover:bg-green-500">
                                <router-link :to="{ name: 'matching' }" @click="startNewGame(), display = false;"
                                    class="text-3xl text-white bg-green-600 p-0 m-0 no-underline border-none hover:bg-green-500 block py-4">Matching</router-link>
                            </li>
                            <li class="game py-2 w-full h-full hover:bg-green-500">
                                <router-link :to="{ name: 'coming-soon' }" @click="display = false"
                                    class="text-3xl text-white bg-green-600 p-0 m-0 no-underline border-none hover:bg-green-500 block py-4">Blackjack</router-link>
                            </li>
                            <li class="game py-2 w-full h-full hover:bg-green-500">
                                <router-link :to="{ name: 'coming-soon' }" @click="display = false"
                                    class="text-3xl text-white bg-green-600 p-0 m-0 no-underline border-none hover:bg-green-500 block py-4">Hearts</router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="home flex bg-green-600 h-16 items-center px-5 hover:bg-green-500">
                        <h2><router-link :to="{ name: 'main-menu' }"
                                class="text-3xl text-white bg-green-600 p-0 m-0 no-underline border-none hover:bg-green-500">Home</router-link>
                        </h2>
                    </li>
                </ul>
            </div>
        </nav>
        <font-awesome-icon icon="fa-solid fa-bars" @click="toggleMenu" class="relative py-4 px-3 h-8 bg-green-600" />
    </header>
</template>

<script>
import { useGameStore } from '@/stores/gameStore.js';

export default {
    setup() {
        const gameStore = useGameStore();
        return { gameStore };
    },
    data() {
        return {
            display: false
        }
    },
    methods: {
        toggleMenu() {
            this.display = !this.display;
        },
        startNewGame() {
            console.log(this.$route)
            if (this.$route.path === "/matching") {
                this.gameStore.clearMatching();
                this.$router.go(this.$router.currentRoute)
            }
        }
    }
}
</script>

<style scoped>
/* Using Tailwind classes in template, minimal custom CSS needed */
.display {
    max-width: 300px;
}

/* Dropdown hover effects that need custom CSS */
nav li ul {
    opacity: 0;
    visibility: hidden;
    transition: all 250ms ease-in-out;
}

nav li:hover ul {
    opacity: 1;
    visibility: visible;
}

/* Clearfix utility */
.cf:after,
.cf:before {
    content: "";
    display: table;
}

.cf:after {
    clear: both;
}
</style>

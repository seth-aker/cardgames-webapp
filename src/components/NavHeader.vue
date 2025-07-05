<template>
    <header class="flex text-white bg-green-700 top-0 justify-between items-center h-16 overflow-hidden">
        <div id="left-header" class="p-2 h-full flex items-center">
            <img src="https://www.deckofcardsapi.com/static/img/spade.svg" alt="spade-img" class="h-4/5 pl-4">
            <h1 class="p-2 text-4xl"> {{ gameStore.pageTitle }} </h1>
        </div>

        <nav id="links" :class="{ display: display }"
            class="absolute flex items-center right-12 top-0 h-16 max-w-0 transition-all duration-1000 ease-in-out p-0">
            <div id="navigation" class="h-16">
                <ul class="cf flex list-none items-center">
                    <li class="dropdown px-5 h-16 flex items-center">
                        <h2 class="text-2xl">Games</h2>
                        <ul
                            class="games float-left left-0 w-150 opacity-0 absolute top-12 invisible z-1 transition duration-250 ease-in-out flex flex-col p-0">
                            <li class="game py-2 w-full h-full">
                                <router-link :to="{ name: 'matching' }" @click="startNewGame(), display = false;"
                                    class="text-2xl text-white bg-green-700 p-0 m-0 no-underline border-none">Matching</router-link>
                            </li>
                            <li class="game py-2 w-full h-full">
                                <router-link :to="{ name: 'coming-soon' }" @click="display = false"
                                    class="text-2xl text-white bg-green-700 p-0 m-0 no-underline border-none">Blackjack</router-link>
                            </li>
                            <li class="game py-2 w-full h-full">
                                <router-link :to="{ name: 'coming-soon' }" @click="display = false"
                                    class="text-2xl text-white bg-green-700 p-0 m-0 no-underline border-none">Hearts</router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="home flex bg-green-700 h-16 items-center px-5">
                        <h2 class="text-2xl"><router-link :to="{ name: 'main-menu' }"
                                class="text-2xl text-white bg-green-700 p-0 m-0 no-underline border-none">Home</router-link>
                        </h2>
                    </li>
                </ul>
            </div>

        </nav>
        <font-awesome-icon icon="fa-solid fa-bars" @click="toggleMenu" class="relative p-4 px-3 h-8 bg-green-700" />
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
@import '@/assets/tailwind.css';
</style>

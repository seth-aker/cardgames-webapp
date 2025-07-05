<template>
    <main class="h-90vh relative">
        <div class="menu-options pt-20vh flex flex-col items-center">
            <div
                class="menu-option new-game flex flex-col items-center justify-center w-300 p-0 m-1.25 bg-green-700 text-white border-2 border-solid rounded-10 text-1.25rem">
                <div class="dropdown">
                    <button type="button"
                        class="collapsable border-none bg-inherit outline-none text-white font-inherit w-300 h-inherit p-4">New
                        Game</button>

                    <div class="dropdown-content flex flex-col p-0 px-4.5 max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-inherit w-300"
                        :class="{ active: newGameActive }">
                        <router-link :to="{ name: 'matching' }" @click="$store.commit('CLEAR_MATCHING')"
                            class="text-white no-underline p-4">Matching</router-link>
                        <router-link :to="{ name: 'blackjack' }"
                            class="text-white no-underline p-4">Blackjack</router-link>
                        <router-link :to="{ name: 'coming-soon' }"
                            class="text-white no-underline p-4">Hearts</router-link>
                    </div>
                </div>

            </div>
            <div
                class="menu-option flex flex-col items-center justify-center w-300 p-0 m-1.25 bg-green-700 text-white border-2 border-solid rounded-10 text-1.25rem">
                <a href="https://www.linkedin.com/in/sethaker" class="text-white no-underline p-4">About Me</a>
            </div>
            <div
                class="menu-option flex flex-col items-center justify-center w-300 p-0 m-1.25 bg-green-700 text-white border-2 border-solid rounded-10 text-1.25rem">
                <a href="https://github.com/seth-aker/" class="text-white no-underline p-4">Source Code</a>
            </div>
        </div>
    </main>
</template>

<script>
import { RouterLink } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
export default {
    name: 'main-menu',
    components: { RouterLink },
    setup() {
        const gameStore = useGameStore()
        return { gameStore }
    },
    data() {
        return {
            newGameActive: false,
            pageTitle: 'Card Games'
        }
    },
    methods: {
        toggleNewGameActive() {
            this.newGameActive = !this.newGameActive;
        }
    },
    created() {
        this.gameStore.updatePageTitle(this.pageTitle)
    }

}
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>

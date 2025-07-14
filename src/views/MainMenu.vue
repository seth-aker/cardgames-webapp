<template>
    <main class="h-screen relative">
        <div class="pt-32 flex flex-col items-center">
            <div
                class="flex flex-col items-center justify-center w-80 p-0 m-1 bg-green-600 text-white border-2 border-solid rounded-xl text-xl hover:bg-green-500 hover:border-white/25">
                <div class="w-full">
                    <button type="button"
                        class="border-none bg-inherit outline-none text-white font-inherit w-80 h-inherit p-4"
                        @click="toggleNewGameActive">New Game</button>

                    <div class="dropdown-content flex flex-col px-5 bg-inherit w-80" :class="{ active: newGameActive }">
                        <router-link :to="{ name: 'matching' }"
                            class="text-white no-underline p-4 hover:bg-green-400 rounded-xl">Matching</router-link>
                        <router-link :to="{ name: 'blackjack' }"
                            class="text-white no-underline p-4 hover:bg-green-400 rounded-xl">Blackjack</router-link>
                        <router-link :to="{ name: 'coming-soon' }"
                            class="text-white no-underline p-4 hover:bg-green-400 rounded-xl">Hearts</router-link>
                    </div>
                </div>
            </div>
            <div
                class="flex flex-col items-center justify-center w-80 p-0 m-1 bg-green-600 text-white border-2 border-solid rounded-xl text-xl hover:bg-green-500 hover:border-white/25">
                <a href="https://www.linkedin.com/in/sethaker" class="text-white no-underline p-4">About Me</a>
            </div>
            <div
                class="flex flex-col items-center justify-center w-80 p-0 m-1 bg-green-600 text-white border-2 border-solid rounded-xl text-xl hover:bg-green-500 hover:border-white/25">
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
/* Custom dropdown animation */
.dropdown-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 500ms ease-in-out;
}

.active {
    max-height: 300px;
}
</style>

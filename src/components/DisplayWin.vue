<template>
    <main class="fixed h-full w-full z-1 bg-black bg-opacity-50 flex justify-center items-start overflow-hidden">
        <div class="relative flex flex-col border-2 border-white bg-green-700 top-50 w-300">
            <h2> &#9733; &#9733; &#9733; You Win! &#9733; &#9733; &#9733;</h2>
            <p>Moves taken: {{ gameStore.matchingAttempts }}</p>
            <p>Time Taken: {{ gameStore.gameTime }}</p>
            <p><a @click="startNewGame" class="text-white no-underline border-2 border-white rounded-10 p-1 px-2">New
                    Matching Game</a></p>
            <p><router-link :to="{ name: 'main-menu' }"
                    class="text-white no-underline border-2 border-white rounded-10 p-1 px-2">Home</router-link></p>
        </div>
    </main>
</template>

<script>
import { useGameStore } from '@/stores/gameStore.js';

export default {
    setup() {
        const gameStore = useGameStore();
        return { gameStore };
    },
    methods: {
        startNewGame() {
            this.gameStore.clearMatching();
            this.$router.go(this.$router.currentRoute)
        }
    }
}
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>

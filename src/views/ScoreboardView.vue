<script setup>
import { useScoreboardStore } from '@/pinia/scoreboard';
import ScoreboardService from '@/services/ScoreboardService'
import ScoreboardList from '@/components/Scoreboard/ScoreboardList'

const scoreboardStore = useScoreboardStore();

const getScores = async() => {
    try {
        const response = await ScoreboardService.getBlackjackScores();
        if(response.status === 200) {
            scoreboardStore.blackjackScores = response.data;
        }
    } catch (error) {
        console.log(error.message);
    }
}
getScores();

</script>

<template>
    <main class="scoreboard">
        <ScoreboardList :scores="scoreboardStore.blackjackScores"></ScoreboardList>
    </main>
</template>

<style scope>
.main {
    display: flex;
}
</style>
<script setup>
import { useGameInfoStore } from '@/pinia/gameInfo';
import { useScoreboardStore } from '@/pinia/scoreboard';
import ScoreboardService from '@/services/ScoreboardService'
import ScoreboardList from '@/components/Scoreboard/ScoreboardList'
import { useUserStore } from '@/pinia/user';
const store = useGameInfoStore();
const scoreboardStore = useScoreboardStore();
const userStore = useUserStore();

const getScores = async() => {
    ScoreboardService.getBlackjackScores()
    .then(response => {
        if(response.status === 200) {
            scoreboardStore.blackjackScores = response.data
        } else {
            throw new Error("Error connecting to score server")
        }
    }).catch(error => {
        console.log(error.message)
    })
    // ScoreboardService.getMatchingScores()
    //.then(response => {
    //     if(response.status === 200) {
    //         scoreboardStore.matchingScores = response.data
    //     } else {
    //         throw new Error("Error connecting to score server")
    //     }
    // }).catch(error => {
    //     console.log(error.message)
    // })
    if(userStore.isLoggedIn){
        ScoreboardService.getBlackjackScores(userStore.user.username)
        .then(response => {
            if(response.status === 200) {
            scoreboardStore.userBjScores = response.data
        } else {
            throw new Error("Error connecting to score server")
        }
    }).catch(error => {
        console.log(error.message)
        })
    }
    }
getScores();
store.pageTitle = "High Scores";
</script>

<template>
    <main> 
        <div class="top-scores">
            <h2>High Scores</h2>
            <div class="scoreboards">
                <ScoreboardList :scores="scoreboardStore.blackjackScores" name="Blackjack"></ScoreboardList>
                <ScoreboardList :scores="scoreboardStore.matchingScores" name="Matching"></ScoreboardList>
                <ScoreboardList :scores="scoreboardStore.heartsScores" name="Hearts"></ScoreboardList>
            </div>
            
        </div>
        <div class="users-best" v-if="userStore.isLoggedIn">
            <h2>Your best scores</h2>
            <div class="scoreboards">
                <ScoreboardList :scores="scoreboardStore.userBjScores" name="Blackjack"></ScoreboardList>
            </div>
        </div>
    </main>
</template>

<style scoped>
h2 {
    color: var(--green-background);
    margin: 10px;
}
main {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "topScores"
                         "usersBest";
}
.top-scores {
    display: flex;
    flex-direction: column;
    grid-area: topScores;
    max-height: 50vh;
}
.scoreboards {
    display: flex;
    overflow: hidden;
}

.users-best {
    height: 50%;
    grid-area: usersBest;
}
</style>
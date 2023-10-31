<script setup>
import { defineProps } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps(['scores', 'name'])

const formatTime = (timeSec) => {
    let minutes;
    let seconds;
    
    let m = timeSec/60;
        if(m < 1){
            minutes ='00';
        } else if(m < 10){
            minutes = `0${Math.floor(m)}`;
        } else {
           minutes = Math.floor(m);
        }
    let s = timeSec % 60;
        if(s === 0) {
           seconds = '00';
        } 
        if(s < 10) {
            seconds = `0${s}`;
        } else {
            seconds = s;
        }
    return `${minutes}:${seconds}`;
}

</script>

<template>
    <div class="list-container">
        <h2>{{ name }}</h2>
        <div class="table">
            <table>
                    <th>Rank</th>
                    <th>Score</th>
                    <th>Username</th>
                    <th>Time</th>
                    <th>Rounds</th>
                <tr v-for="(listItem, index) in scores" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ listItem.score }}</td>
                    <td>{{ listItem.username }}</td>
                    <td>{{ formatTime(listItem.timeSeconds) }}</td>
                    <td>{{ listItem.rounds }}</td>
                </tr>
            </table>

        </div>
    </div>

</template>

<style scoped>

.list-container {
    background-color: var(--green-hover);
    margin: 15px;
    width: 100%;
}
.table {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    height: 90%;
}

h2 {
    margin: 0;
    background-color: var(--green-background);
    padding: 5px;
}

table {
    padding: 5px;

}
</style>
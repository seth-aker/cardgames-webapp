<script setup>
import { defineProps } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps(['scores'])

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
         <table>
                <th>Score</th>
                <th>Username</th>
                <th>Time</th>
                <th>Rounds</th>
            <tr v-for="(listItem, index) in scores" :key="index">
                <td>{{ listItem.score }}</td>
                <td>{{ listItem.username }}</td>
                <td>{{ formatTime(listItem.timeSeconds) }}</td>
                <td>{{ listItem.rounds }}</td>
            </tr>
        </table>
    </div>

</template>

<style scoped>
.list-container {
    background-color: var(--green-background);
}
</style>
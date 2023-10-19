import { computed, ref } from "vue";
import { useGameInfoStore } from "@/pinia/gameInfo";

const getTimer = () => {
    const store = useGameInfoStore();
    const totalSec = ref(0);
    const isGameOver = ref(false)
    const startTimer = () => {
        //in case timer needs to restart without resetting completely.
        isGameOver.value = false;
        let timer = setInterval(() => {
            if(isGameOver.value) {
                clearInterval(timer);
            }
            totalSec.value++
            store.gameTimeSec = totalSec;
        }, 1000)
    
    };

    const minutes = ref(computed(() => {
        let m = totalSec.value/60;
        if(m < 1){
            return '00';
        } 
        if(m < 10){
            return `0${Math.floor(m)}`;
        }
        return Math.floor(m);
       
    }));

    const seconds = ref(computed(() => {
        let s = totalSec.value % 60;
        if(s === 0) {
            return '00';
        } 
        if(s < 10) {
            return `0${s}`;
        } else {
            return s;
        }
    }));

    const stopTimer = () => {
        isGameOver.value = true;
        store.gameTime = `${minutes.value}:${seconds.value}`;
    }
    

    return { seconds, minutes, startTimer, stopTimer}
}

export default getTimer;
<template>
    <div class="chip" @click="addToWager">
        <img src="../assets/pokerchip.svg" :alt="'$'+ {value}" :style="{color: color}"/>
    </div>
</template>

<script>

export default {
    name: 'Poker-Chip',
    props: ['value', 'color'],
    methods: {
        addToWager(){
            let wager = this.currentWager + this.value;
            if(this.playerWallet - wager >= 0) {
                this.$store.commit('bj/SET_WAGER', wager);
            } else {
                alert("Cannot wager more than you have in your wallet")
            }

        }
    },
    computed: {
        playerWallet() {
            return this.$store.state.bj.player.wallet;
        },
        currentWager() {
            return this.$store.state.bj.player.wager;
        }
    }
}
</script>

<style scoped>
.chip img {
    width: 50px;
    height: 50px;
    margin: 0;
    padding: 0;
}
.white {
    color: white;
    background-color: black;
}
.red{
    color: red;
}
.blue {
    color: blue;
}
.grey{
    color: grey;
}
.green {
    color: green;
}
.orange {
    color: orange;
}
.black {
    color: black;
}
</style>
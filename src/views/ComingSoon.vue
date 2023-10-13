<template>
  <div class="coming-soon">
    <h1>Coming Soon!</h1>

    <!-- for testing:
      <div v-for="(card, index) in 2" :key="index" :style="{left: offset(index)}" class="card-container">
      <div class="card">
        <div class="card-inner">
          <img src="https://www.deckofcardsapi.com/static/img/back.png" alt="">
       </div>
      </div>
    </div>
     -->

    
  </div>
</template>

<script>

export default {
// testing
// methods: {
//   offset(index) {
//     return `${(index+1)*35}px`
//   }
// }

}
</script>

<style scoped>
.coming-soon{
  color: black;
}
/*  testing purposes
  .card-container {
  position: absolute;
}
.card{
  background-color: transparent;
  width: 100%;
    height: 100%;
    perspective: 1000px;
    margin: 0.5rem;
    position: absolute;
}

.card-inner{
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    -webkit-transition: all 0.8s ;
    -moz-transition: all 0.8s ;
    -ms-transition: all 0.8s ;
    -o-transition: all 0.8s ;
    transition: all 0.8s ;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
} */
</style>

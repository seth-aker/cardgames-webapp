<template>
   <main>
      <div class="menu-options">
          <div class="menu-option new-game">
              <div class="dropdown">
                <button type="button" class="collapsable" @click="toggleNewGameActive">New Game</button>
            
                <div class="dropdown-content" :class="{active: newGameActive}">
                    <a href="" >Matching</a>
                    <a href="" >Blackjack</a>
                    <a href="" >Hearts</a>
                </div>
              </div>
            
          </div>
          <div class="menu-option">
            <a href="https://www.linkedin.com/in/sethaker">About Me</a>
          </div>
          <div class="menu-option">
            <a href="https://github.com/seth-aker/Cardgames_v3">Source Code</a>
          </div>
      </div>
  </main>
</template>

<script>
export default {
    data() {
        return {
            newGameActive: false
        }
    },
    methods: {
        toggleNewGameActive() {
            this.newGameActive = !this.newGameActive;
        }
    }
    
}
</script>

<style scoped>
main{
    height: 90vh;
}
.menu-options{
    padding-top: 20vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
    
.menu-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    padding: 1rem;
    margin: 5px;
    background-color: rgb(84, 134, 84);
    color: white;
    border: 2px solid;
    border-radius: 10px;   
    font-size: 1.25rem;   

}

.menu-option:hover{
    background-color: rgb(116, 177, 116);
    border: 2px rgba(255, 255, 255, 0.267) solid;
}  

.menu-option a{
    color: white;
    text-decoration: none;
}

.menu-option .dropdown button {
    border: none;
    background-color: inherit;
    outline: none;
    color: white;
    font: inherit;
    width: inherit;
    height: inherit;
}


.dropdown-content {
    position: absolute;
    display: flex;
    flex-direction: column;
    
    opacity: 0;
    transition: opacity 400ms;
}

.active {
    opacity: 1;
}











</style>
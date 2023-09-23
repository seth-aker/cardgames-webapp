<template>
   <main>
      <div class="menu-options">
          <div class="menu-option new-game">
              <div class="dropdown">
                <button type="button" class="collapsable" @click="toggleNewGameActive">New Game</button>
            
                <div class="dropdown-content" :class="{active: newGameActive}">
                    <router-link :to="{name: 'matching'}" @click="$store.commit('CLEAR_MATCHING')">Matching</router-link>
                    <router-link :to="{name: 'coming-soon'}">Blackjack</router-link>
                    <router-link :to="{name: 'coming-soon'}">Hearts</router-link>
                </div>
              </div>
            
          </div>
          <div class="menu-option">
            <a href="https://www.linkedin.com/in/sethaker">About Me</a>
          </div>
          <div class="menu-option">
            <a href="https://github.com/seth-aker/">Source Code</a>
          </div>
      </div>
  </main>
</template>

<script>
export default {
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
        this.$store.commit('UPDATE_PAGE_TITLE', this.pageTitle)
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
    padding: 0;
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
    padding: 1rem;
}

.menu-option .dropdown button {
    border: none;
    background-color: inherit;
    outline: none;
    color: white;
    font: inherit;
    width: 300px;
    height: inherit;
    padding: 1rem;

}


.dropdown-content {
    display: flex;
    flex-direction: column;
    padding: 0 18px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 500ms ease-in-out;
    background-color: inherit;
    width: 300px;
    
}

.dropdown-content a {
    padding: 1rem;
    
}

.dropdown-content a:hover{
    background-color: rgb(135, 192, 135);
    border-radius: 10px;
}
.active {
    max-height: 300px;
}












</style>
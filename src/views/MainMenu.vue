<template>
   <main>
      <div class="menu-options">
          <div class="new-game dropdown">
            <a href="" @click.prevent="" >New Game</a>
            
            <div class="dropdown-content">
                <a href="" class="">Matching</a>
                <a href="" >Blackjack</a>
                <a href="" >Hearts</a>
            </div>
          </div>
          <div class="about-me">
            <a href="https://www.linkedin.com/in/sethaker">About Me</a>
          </div>
          <div class="source-code">
            <a href="https://github.com/seth-aker/Cardgames_v3">Source Code</a>
          </div>
      </div>
  </main>
</template>

<script>
export default {

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

/* .dropdown:hover > a {
    display: none;
}

.dropdown-content {
    display: none;
}

 .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: column;
    transition: 400ms;
} */
.new-game{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    padding: 2vh;
    margin: 5px;
    background-color: rgb(84, 134, 84);
    color: white;
    border: 2px solid;
    border-radius: 10px;   
    font-size: 1.25rem;
}
.about-me, .source-code{
    width: 300px;
    height: 25px;
    padding: 2vh;
    margin: 5px;
    background-color: rgb(84, 134, 84);
    color: white;
    text-decoration: none;
    border: 2px solid;
    border-radius: 10px;   
    font-size: 1.25rem;
}
.about-me:hover, .source-code:hover, .new-game:hover{
    background-color: rgb(116, 177, 116);
    border: 2px rgba(255, 255, 255, 0.267) solid;
}  


.new-game a, .about-me a, .source-code a{
    color: white;
    text-decoration: none;
}
</style>
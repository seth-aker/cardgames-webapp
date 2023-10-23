<template>
    <main id="login" >
        <div class="login">
            <form @submit.prevent="signIn" class="login-form">
                <h2>Login</h2>
                <p v-if="$route.redirectedFrom">Please Sign In to Save Game</p>
                <p v-show="invalidCredentials">Invalid username or password</p>
                <input type="text" v-model="user.username" id="username" placeholder="Username" required autofocus>
                <input type="password" v-model="user.password" id="password" placeholder="Password" required>
                <input type="submit" value="Sign In" class="button"/>
                <router-link :to="{name: 'register'}">Don't have an account? Click here to register</router-link>
            </form>
        </div>
    </main>
</template>

<script>
import AuthService from '@/services/AuthService';
import { useUserStore } from '@/pinia/user';
import { useGameInfoStore } from '@/pinia/gameInfo';
export default {
    name: 'login-page',
    setup() {
        const userStore = useUserStore();
        const gameInfoStore = useGameInfoStore();
        return { userStore, gameInfoStore }
    },
    data() {
        return {
            user: {
                username: "",
                password: ""
            },
            invalidCredentials: false
        }
    },
    methods: {
        signIn() {
            AuthService.login(this.user)
            .then(response => {
                if (response.status == 200) {
                this.userStore.setAuthToken(response.data.token);
                this.userStore.setUser(response.data.user)
                this.$router.push(this.$route.query.redirect || {name: 'main-menu'});
            }
            })
            .catch(error => {
                // const response = error.response;
                if (error.response.status === 403) {
                    this.invalidCredentials = true;
                }
            });
        }
    }
}
</script>

<style scoped>
main{
    height: 90vh;
    position: relative;
    display: flex;
    justify-content: center;
}
.login{
     margin-top: 20vh;
     background-color: var(--green-background);
     width: 75%;
     max-width: 300px;
     height: fit-content;
     border-radius: var(--default-radius);
     
}
.login-form{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: var(--default-radius);
}

h2 {
    margin: 0;
}

input {
    width: 90%;
    margin: 10px;
    border-radius: 5px
}

.button {
    width: 50%;
}

a {
    color: white;
    font-size: 0.75rem;
    padding-top: 10px;
}

a:hover {
    color: rgb(43, 43, 255);
}
</style>


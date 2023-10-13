<template>
    <main id="login" >
        <div class="login">
            <form @submit.prevent="signIn" class="login-form">
                <h2>Login</h2>
                <input type="text" v-model="user.username" id="username" placeholder="Username" required autofocus>
                <input type="password" v-model="user.password" id="password" placeholder="Password" required>
                <input type="submit" value="Sign In" class="button"/>
            </form>
        </div>
    </main>
</template>

<script>
import AuthService from '@/services/AuthService';
export default {
    name: 'login-page',
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
                this.$store.commit("SET_AUTH_TOKEN", response.data.token);
                this.$store.commit("SET_USER", response.data.user);
                this.$router.push({name:'main-menu'});
            }
            })
            .catch(error => {
            const response = error.response;

            if (response.status === 401) {
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
</style>


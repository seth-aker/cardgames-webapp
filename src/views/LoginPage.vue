<template>
    <main id="login" class="">
        <form @submit.prevent="signIn" class="login">
            <input type="text" v-model="user.username" id="username" placeholder="Username" required autofocus>
            <input type="password" v-model="user.password" id="password" placeholder="Password" minlength="8" required>
            <input type="submit" value="Sign In" />
        </form>
    </main>
</template>

<script>
export default {
    data() {
        return {
            user: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        signIn() {
            
        }
    }
}
</script>

<style scoped>
main{
    height: 90vh;
    position: relative;
}

.login {
    padding-top: 20vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>


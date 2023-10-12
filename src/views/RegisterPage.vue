<template>
    <main>
        <div class="register">
            <form @submit.prevent="register" class="register-form" >
                <h2>Register</h2>
                <input type="text" v-model="user.username" required placeholder="Username"/>
                <input type="password" v-model="user.password" required minlength="8" placeholder="Password"/>
                <input type="password" v-model="user.confirmPassword" required minlength="8" placeholder="Confirm Password" />
                <input type="submit" value="Register" class="button">
            
            </form>
        </div>
    </main>
</template>

<script>
import AuthService from '@/services/AuthService';

export default {
    name: 'register-page',
    data() {
        return {
            user: {
                username: '',
                password: '',
                confirmPassword: '',
                role: 'user',
            },
            registrationErrors: false,
            registrationErrorMsg: 'There were problems registering this user.',
        }
    },
    methods: {
        register() {
            if (this.user.password != this.user.confirmPassword) {
                this.registrationErrors = true;
                this.registrationErrorMsg = 'Password & Confirm Password do not match.';
            } else {
                AuthService.register(this.user)
                    .then((response) => {
                    if (response.status == 201) {
                    this.$router.push({
                        path: '/login',
                        query: { registration: 'success' },
                    });
                    }
                })
                .catch((error) => {
                    const response = error.response;
                    this.registrationErrors = true;
                    if (response.status === 400) {
                    this.registrationErrorMsg = 'Bad Request: Validation Errors';
                    }
                });
            } 
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
.register{
     margin-top: 20vh;
     background-color: var(--green-background);
     width: 75%;
     max-width: 300px;
     height: fit-content;
     border-radius: var(--default-radius);
     
}
.register-form{
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
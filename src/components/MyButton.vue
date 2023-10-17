<script setup>
import { defineProps } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    onClick: {
        type: Function,
        required: true
    }
})

</script>

<template>
    <button @click="onClick"> 
        <slot>Click Me</slot>
    </button>
</template>

<style scoped>
button {
    width: 100%;
    height: 100%;
    color: white;
    background-color: var(--green-background);
    border-radius: var(--default-radius);

}

button:hover {
    background-color: var(--green-hover);
}
</style>
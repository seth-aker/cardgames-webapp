<template>
    <div class="bg-transparent w-full perspective-1000 m-2" @click="handleClick" :class="{ show: isFlipped }"
        data-testid="playing-card">
        <div class="relative w-full h-full text-center transition-all duration-800"
            style="transform-style: preserve-3d;">
            <div class="absolute w-full h-full backface-hidden">
                <img :src="cardbackURL" alt="card-back" class="h-90">
            </div>
            <div class="absolute w-full h-full backface-hidden rotate-y-180">
                <img :src="imageUrl" :alt="cardName" class="h-90">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    isFlipped: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['card-clicked'])

// Data
const cardbackURL = ref('https://www.deckofcardsapi.com/static/img/back.png')

// Methods
const handleClick = () => {
    if (!props.disabled && !props.isFlipped) {
        emit('card-clicked', props.cardName)
    }
}
</script>

<style scoped>
@import '@/assets/tailwind.css';
</style>

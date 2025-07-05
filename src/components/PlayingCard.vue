<template>
    <div class="bg-transparent w-full h-full cursor-pointer" style="perspective: 1000px;" @click="handleClick"
        :class="{ show: isFlipped }" data-testid="playing-card">
        <div class="card-inner relative w-full h-full text-center transition-all duration-800 preserve-3d">
            <div class="card-back absolute w-full h-full backface-hidden flex items-center justify-center">
                <img :src="cardbackURL" alt="card-back" class="w-full h-full object-contain">
            </div>
            <div class="card-face absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center">
                <img :src="imageUrl" :alt="cardName" class="w-full h-full object-contain">
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
/* All styles converted to Tailwind CSS classes and utilities */
</style>

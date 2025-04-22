<template>
    <img
        class="category-icon"
        :src="`/icons/${categoryKey}.svg`"
        :alt="categoryKey"
        @error="onError"
    />
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
});

const fallbackSrc = "/icons/default.png";
const currentSrc = ref(null);

const categoryKey = computed(() => {
    if (!props.categories || props.categories.length === 0) return "default";
    return props.categories[props.categories.length - 1].toLowerCase();
});

const onError = (e) => {
    if (e.target.src !== location.origin + fallbackSrc) {
        e.target.src = fallbackSrc;
    }
};
</script>

<style scoped>
.category-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
}
</style>

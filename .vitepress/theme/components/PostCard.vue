<template>
    <a :href="post.url" class="card">
        <div class="card-icon-title">
            <CategoryIcon :categories="post.frontmatter.categories" />
            <div class="card-title">{{ post.frontmatter.title }}</div>
        </div>
        <p class="card-category-path">
            {{ post.frontmatter.categories.join(" / ") }}
        </p>
        <div class="card-footer">
            <span class="card-date">
                {{
                    new Date(post.frontmatter.date).toLocaleDateString("ko-KR")
                }}
            </span>
            <span v-if="isNew(post.frontmatter.date)" class="new-badge">
                NEW
            </span>
        </div>
    </a>
</template>

<script setup>
import CategoryIcon from "./CategoryIcon.vue";
const props = defineProps({
    post: Object,
});

const isNew = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24); // 일(day) 차이
    return diff <= 7;
};
</script>

<style scoped>
.card {
    background-color: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    color: var(--vp-c-text-1);
    padding: 1rem;
    border-radius: 10px;
    transition: all 0.2s ease;
    cursor: pointer;
    display: block;
    text-decoration: none;
    color: inherit;
}

.card:hover {
    background-color: var(--vp-c-bg-alt);
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.card-icon-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
}

.card-title {
    font-weight: bold;
}

.card-title:hover {
    text-decoration: underline;
}

.card-category-path {
    font-size: 0.7rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.3rem;
}

.card-footer {
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-date {
    font-size: 0.75rem;
    color: #aaa;
}

.new-badge {
    background-color: var(--vp-c-brand-1);
    color: black;
    font-size: 0.65rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 999px;
}
</style>

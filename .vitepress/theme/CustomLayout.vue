<template>
    <Layout>
        <template #doc-before>
            <div class="post-meta">
                <h1>{{ frontmatter.title }}</h1>
                <p class="description">{{ frontmatter.description }}</p>
                <p class="date">{{ formattedDate }}</p>
            </div>
        </template>
        <Content />
    </Layout>
</template>

<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { toRefs, computed } from "vue";

const { Layout } = DefaultTheme;
const { frontmatter } = toRefs(useData());

const formattedDate = computed(() => {
    if (!frontmatter.value.date) return "Not Set!";
    const date = new Date(frontmatter.value.date);
    if (isNaN(date.getTime())) return "Invalid Date!";
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});
</script>

<style scoped>
.post-meta {
    margin-bottom: 2rem;
}
.post-meta h1 {
    margin: 0;
}
.description {
    color: #7fa9d6;
    font-size: 0.9rem;
    margin: 0.5rem 0;
}
.date {
    color: #888;
    font-size: 0.8rem;
    text-align: right;
}
</style>

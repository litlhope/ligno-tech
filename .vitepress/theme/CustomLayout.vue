<template>
    <Layout>
        <template #doc-before>
            <div class="post-meta-wrapper">
                <div class="post-meta">
                    <h1>{{ frontmatter.title }}</h1>
                    <p class="description">{{ frontmatter.description }}</p>
                    <p class="date">{{ formattedDate }}</p>
                </div>
                <div v-if="frontmatter.thumbnail" class="thumbnail-container">
                    <img
                        :src="frontmatter.thumbnail"
                        :alt="frontmatter.title"
                        class="thumbnail-image"
                    />
                </div>
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
    if (!frontmatter.value.date) return "-";
    const date = new Date(frontmatter.value.date);
    if (isNaN(date.getTime())) return "E";
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});
</script>

<style scoped>
.post-meta-wrapper {
    margin-bottom: 2rem;
}

.post-meta {
    padding: 1rem;
    /* background-color: rgba(255, 255, 255, 0.8); */
    border-radius: 8px;
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

/* 섬네일 스타일 */
.thumbnail-container {
    display: flex;
    justify-content: center;
    overflow: hidden;
    max-height: 200px;
    margin-top: 1rem;
}

.thumbnail-image {
    max-width: 100%;
    height: auto;
    object-fit: cover;
    object-position: center;
}
</style>

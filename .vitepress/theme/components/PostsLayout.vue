<!-- .vitepress/theme/components/PostsLayout.vue -->
<script setup>
import { data as posts } from "../posts.data.mjs";
import PostCard from "./PostCard.vue";

// 최신순 정렬된 전체 글 목록
const sortedPosts = posts;
</script>

<template>
    <section class="all-posts px-4 py-6 max-w-6xl mx-auto">
        <h1 class="page-title">📚 전체 글 보기</h1>

        <div class="card-list">
            <PostCard
                v-for="post in sortedPosts"
                :key="post.url"
                :post="post"
            />
        </div>
    </section>
</template>

<style scoped>
.all-posts {
    margin: 2rem 0;
}

.page-title {
    display: flex;
    align-items: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vp-c-divider);
    color: var(--vp-c-brand-1);
}

.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
}
</style>

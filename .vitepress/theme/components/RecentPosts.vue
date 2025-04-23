<template>
    <div class="recent-posts">
        <h2 class="recent-title">📝 최신 글</h2>
        <div class="card-list">
            <PostCard
                v-for="post in recentPosts"
                :key="post.url"
                :post="post"
            />
        </div>
    </div>
    <div class="recent-more">
        <a href="/posts/about" class="more-link">모든 글 보기 →</a>
    </div>
</template>

<script setup>
import PostCard from "./PostCard.vue";
import { data as posts } from "../posts.data.mjs";

const recentPosts = posts.slice(0, 8);
</script>

<style scoped>
.recent-posts {
    margin: 2rem 0;
}

.recent-title {
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--vp-c-brand-1);
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vp-c-divider);
}

.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
}

.recent-more {
    margin-top: 1.5rem;
    text-align: right;
}

.more-link {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: color 0.2s ease;
}

.more-link:hover {
    text-decoration: underline;
    color: var(--vp-c-brand-2);
}
</style>

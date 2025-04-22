<template>
    <div class="recent-posts">
        <h2 class="recent-title">📝 최신 글</h2>
        <div class="card-list">
            <a
                v-for="post in recentPosts"
                :key="post.url"
                :href="post.url"
                class="card"
            >
                <div class="card-icon-title">
                    <CategoryIcon :categories="post.frontmatter.categories" />
                    <div class="card-title">
                        {{ post.frontmatter.title }}
                    </div>
                </div>
                <p class="card-category-path">
                    {{ post.frontmatter.categories.join(" / ") }}
                </p>
                <div class="card-footer">
                    <span class="card-date">
                        {{
                            new Date(post.frontmatter.date).toLocaleDateString(
                                "ko-KR",
                            )
                        }}
                    </span>
                    <span v-if="isNew(post.frontmatter.date)" class="new-badge">
                        NEW
                    </span>
                </div>
            </a>
        </div>
    </div>
    <div class="recent-more">
        <a href="/posts" class="more-link">모든 글 보기 →</a>
    </div>
</template>

<script setup>
import CategoryIcon from "./CategoryIcon.vue";
import { data as posts } from "../posts.data.mjs";

const recentPosts = posts.slice(0, 8);

const isNew = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24); // 일(day) 차이
    return diff <= 7;
};

const getCategoryIcon = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0)
        return "/icons/default.svg";
    const key = categories[categories.length - 1].toLowerCase();
    const map = {
        nginx: "/icons/nginx.svg",
        docker: "/icons/docker.svg",
        flutter: "/icons/flutter.svg",
        certbot: "/icons/certbot.svg",
        command: "/icons/command.svg",
        infra: "/icons/infra.svg",
        default: "/icons/file.svg",
    };
    return map[key] || map.default;
};

const getCategoryLabel = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0)
        return "카테고리";
    return categories[categories.length - 1];
};
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

.card {
    background-color: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    color: var(--vp-c-text-1);
    padding: 1rem;
    border-radius: 10px;
    transition: all 0.2s ease;
    cursor: pointer; /* 클릭 가능 UI로 인식 */
    display: block;
    text-decoration: none;
    color: inherit;
}

.card:hover {
    background-color: var(--vp-c-bg-alt);
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 라이트에도 어울리는 그림자 */
    transform: translateY(-4px);
}

.card-title {
    font-weight: bold;
    text-decoration: none;
}

.card-title:hover {
    text-decoration: underline;
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

.card-icon-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
}

.card-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.card-category-path {
    font-size: 0.7rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.3rem;
}
</style>

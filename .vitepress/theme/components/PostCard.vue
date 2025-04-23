<template>
    <a :href="post.url" class="card">
        <!-- 배경 이미지 -->
        <div
            v-if="hasThumbnail"
            class="card-bg"
            :style="{ backgroundImage: `url(${post.frontmatter.thumbnail})` }"
        ></div>

        <!-- 카드 내용 -->
        <div class="card-content">
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
                        new Date(post.frontmatter.date).toLocaleDateString(
                            "ko-KR",
                        )
                    }}
                </span>
                <span v-if="isNew(post.frontmatter.date)" class="new-badge">
                    NEW
                </span>
            </div>
        </div>
    </a>
</template>

<script setup>
import CategoryIcon from "./CategoryIcon.vue";

const props = defineProps({
    post: Object,
});

const hasThumbnail =
    props.post.frontmatter.thumbnail &&
    props.post.frontmatter.thumbnail.trim() !== "";

const isNew = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24); // 일(day) 차이
    return diff <= 7;
};
</script>

<style scoped>
.card {
    position: relative;
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
    overflow: hidden;
}

.card:hover {
    background-color: var(--vp-c-bg-alt);
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 4px 12px var(--vp-c-shadow);
    transform: translateY(-4px);
}

.card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: blur(12px);
    opacity: 0.2;
    z-index: 0;
}

.card-content {
    position: relative;
    z-index: 1;
}

.card-icon-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
}

.card-title {
    font-weight: bold;
    text-decoration: none;
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
    color: var(--vp-c-text-2);
}

.new-badge {
    background-color: var(--vp-c-brand-2);
    color: var(--vp-c-text-1);
    font-size: 0.65rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 999px;
}
</style>

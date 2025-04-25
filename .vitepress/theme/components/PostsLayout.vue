<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { data as posts } from "../posts.data.mjs";
import PostCard from "./PostCard.vue";

const sortOrder = ref("desc");
const selectedCategory = ref("All");
const selectedTags = ref([]);

const categories = computed(() => {
    const set = new Set();
    posts.forEach((p) => p.frontmatter.categories?.forEach((c) => set.add(c)));
    return Array.from(set);
});

const tags = computed(() => {
    const set = new Set();
    posts.forEach((p) => p.frontmatter.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const sortedPosts = computed(() => {
    return [...posts].sort((a, b) => {
        const da = new Date(a.frontmatter.date);
        const db = new Date(b.frontmatter.date);
        return sortOrder.value === "desc" ? db - da : da - db;
    });
});

const filteredPosts = computed(() => {
    return sortedPosts.value.filter((p) => {
        const fm = p.frontmatter;
        const catOk =
            selectedCategory.value === "All" ||
            fm.categories?.includes(selectedCategory.value);
        const tagsOk =
            selectedTags.value.length === 0 ||
            selectedTags.value.some((tag) => fm.tags?.includes(tag));
        return catOk && tagsOk;
    });
});

const displayCount = ref(50);
const visiblePosts = computed(() =>
    filteredPosts.value.slice(0, displayCount.value),
);

const loadMoreTrigger = ref(null);
onMounted(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                displayCount.value += 50;
            }
        },
        { rootMargin: "200px" },
    );
    if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value);
});

const showTagDropdown = ref(false);

const handleClickOutside = (event) => {
    const dropdown = document.querySelector(".tag-dropdown-wrapper");
    if (dropdown && !dropdown.contains(event.target)) {
        showTagDropdown.value = false;
    }
};

document.addEventListener("click", handleClickOutside);
onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <section class="all-posts">
        <h1 class="page-title">📚 전체 글 보기</h1>

        <div class="filters">
            <select v-model="sortOrder" class="filter-select">
                <option value="desc">최신순</option>
                <option value="asc">오래된순</option>
            </select>

            <select v-model="selectedCategory" class="filter-select">
                <option value="All">전체 카테고리</option>
                <option v-for="cat in categories" :key="cat">{{ cat }}</option>
            </select>

            <div class="tag-dropdown-wrapper">
                <button
                    @click.stop="showTagDropdown = !showTagDropdown"
                    class="tag-button"
                >
                    전체 태그
                    <span v-if="selectedTags.length > 0" class="tag-selected"
                        >({{ selectedTags.length }}개 선택됨)</span
                    >
                </button>
                <div v-if="showTagDropdown" class="tag-list">
                    <label v-for="tag in tags" :key="tag" class="tag-item">
                        <input
                            type="checkbox"
                            :value="tag"
                            v-model="selectedTags"
                        />
                        <span>{{ tag }}</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="card-list">
            <PostCard
                v-for="post in visiblePosts"
                :key="post.url"
                :post="post"
            />
        </div>

        <div ref="loadMoreTrigger" class="h-10"></div>
    </section>
</template>

<style scoped>
.all-posts {
    padding: 2.5rem 1.5rem;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
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

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.filter-select {
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    cursor: pointer;
}

.tag-dropdown-wrapper {
    position: relative;
}

.tag-button {
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    cursor: pointer;
}

.tag-selected {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
}

.tag-list {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    margin-top: 0.5rem;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 600px;
}

.tag-item {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
}

.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
}
</style>

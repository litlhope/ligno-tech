<template>
    <section class="partners-section">
        <h2 class="partners-title">제휴 사이트</h2>
        <div class="partners-grid" :style="gridColumnStyle">
            <a
                v-for="partner in partners"
                :key="partner.title"
                :href="partner.link"
                target="_blank"
                rel="noopener"
                class="partner-card"
            >
                <img
                    :src="partner.icon?.src"
                    :alt="partner.title"
                    class="partner-icon"
                />
                <div class="partner-text">
                    <div class="partner-title">{{ partner.title }}</div>
                    <div class="partner-details" v-html="partner.details" />
                </div>
            </a>
        </div>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { frontmatter } = useData();
const partners = frontmatter.value.partners || [];

const gridColumnStyle = computed(() => {
    const count = partners.length;
    const columns = count >= 3 ? 3 : count === 2 ? 2 : 1;
    return {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
    };
});
</script>

<style>
.partners-section {
    margin: 0 auto;
    padding: 2rem 1rem;
    background-color: var(--vp-c-bg-soft);
    border-radius: 12px;
    max-width: 1200px;
}

.partners-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
    color: var(--vp-c-brand-1);
}

.partners-section h2.partners-title {
    /* 기본 vp-doc h2 스타일 무시하고 재정의 */
    margin: 0;
    padding: 0.5rem 0;
    border-top: none;
    font-size: 1.5rem;
    line-height: 1.2;
    color: var(--vp-c-brand-1);
    background: transparent;
}

.partners-grid {
    display: grid;
    gap: 1.2rem;
    justify-content: center;
}

/* 태블릿 이하에서는 2개 */
@media (max-width: 1024px) {
    .partners-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

/* 모바일에서는 1개 */
@media (max-width: 640px) {
    .partners-grid {
        grid-template-columns: 1fr !important;
    }
}

a.partner-card {
    display: flex;
    align-items: center;
    padding: 1.2rem 1.5rem;
    background-color: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    width: 100%;
    max-width: 540px;
    transition:
        background-color 0.2s ease,
        transform 0.2s ease;

    /* 링크 스타일 제거 */
    text-decoration: none;
    color: inherit;
}

a.partner-card:hover {
    transform: translateY(-3px);
    background-color: var(--vp-c-bg-alt);
}

.partner-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
    margin-right: 1.5rem;
    flex-shrink: 0;
}

.partner-text {
    flex: 1;
}

a.partner-card .partner-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: var(--vp-c-text-1);
    text-decoration: none;
}

a.partner-card .partner-details {
    font-size: 0.95rem;
    color: var(--vp-c-text-2);
    line-height: 1.5;
    text-decoration: none;
}

@media (max-width: 768px) {
    .partners-grid {
        flex-direction: column;
    }

    a.partner-card {
        max-width: 100%;
        flex: 1 1 100%;
    }
}
</style>

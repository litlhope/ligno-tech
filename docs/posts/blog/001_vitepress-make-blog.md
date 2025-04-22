---
layout: doc
title: VitePress 기반 기술 블로그 구축기
date: "2025-04-21T18:13:00"
description: VitePress로 기술 블로그를 구축하는 과정을 정리한 기록입니다.
comments: true
categories: [Blog]
tags: [CLI, Command, VitePress, Setting]
---

## 🛫 시작하며...

이 글은 VitePress를 활용해 커스터마이징이 가능한 기술 블로그를 구축한 전체 과정을 정리한 기록입니다. 댓글 기능, 최신 글 표시, 커스텀 레이아웃, 사이드바 자동 생성 등 실제 운영에 필요한 구성을 단계별로 적용한 사례를 다루고 있습니다.

---

## 📘 VitePress란?

VitePress는 [Vite](https://vitejs.dev)와 [Vue 3](https://vuejs.org)를 기반으로 한 정적 사이트 생성기입니다. 빠른 개발 환경, Markdown 기반 콘텐츠 작성, Vue 컴포넌트와의 쉬운 통합 기능을 제공하여 기술 블로그, 프로젝트 문서, 개인 홈페이지 등 다양한 용도로 사용할 수 있습니다.

---

## 1. 설치 및 기본 블로그 생성

먼저 블로그 프로젝트 디렉터리를 생성하고 VitePress를 설치합니다.

```bash
$ mkdir blog-root
$ cd blog-root
$ yarn add -D vitepress
$ yarn vitepress init
$ yarn run docs:dev
```

`vitepress init`을 실행하면 초기 설정 마법사가 실행됩니다. 아래는 각 질문과 그에 대한 선택 항목입니다:

```
◇  Where should VitePress initialize the config? → ./
◇  Site title: → Dev
◇  Site description: → Dev Blog
◇  Theme: → Default Theme + Customization
◇  Use TypeScript for config and theme files? → No
◇  Add VitePress npm scripts to package.json? → Yes
```

선택한 이유는 다음과 같습니다:

- `.vitepress` 설정 디렉터리는 루트에, Markdown 콘텐츠는 `/docs` 디렉터리에 분리해 구성하기 위해 `./`로 설정했습니다.
- 사이트 제목과 설명은 추후 변경 가능하기 때문에 임시로 입력했습니다.
- 댓글, 최신 글 등 기능 확장을 고려해 커스터마이징 가능한 테마를 선택했습니다.
- JavaScript 환경이 익숙하여 TypeScript는 사용하지 않도록 했습니다.
- 편리한 명령어 실행을 위해 스크립트를 package.json에 추가했습니다.

이후 `.vitepress/config.mjs`에 다음과 같이 `srcDir`을 설정해 `/docs`를 문서 루트로 지정합니다. 설정 디렉터리와 콘텐츠 디렉터리를 분리하면 구조가 명확해지고 유지보수가 쉬워집니다.

```js
export default defineConfig({
  srcDir: './docs',
  // 기타 설정 생략
});
```

---

## 2. 댓글 기능 활성화 (Giscus)

GitHub Discussions 기반 댓글 기능인 Giscus를 적용합니다.

```bash
yarn add vitepress-plugin-comment-with-giscus
```

`.vitepress/theme/index.js`에서 `setup()` 함수 내부에 다음과 같이 설정을 추가합니다:

```js
import giscusTalk from "vitepress-plugin-comment-with-giscus";

setup() {
  const { frontmatter } = toRefs(useData());
  const route = useRoute();

  giscusTalk(
    {
      repo: "litlhope/litlcity",
      repoId: "...",
      category: "Announcements",
      categoryId: "...",
      mapping: "pathname",
      lang: "ko",
      lightTheme: "light",
      darkTheme: "transparent_dark",
      homePageShowComment: false,
    },
    { frontmatter, route },
    true
  );
}
```

### Giscus 설정 방법 요약

1. [Giscus 공식 사이트](https://giscus.app/)에 접속합니다.
2. 사용할 GitHub 저장소를 연결합니다. (Discussions 기능 필요)
3. 카테고리를 선택합니다.
4. Mapping은 `pathname`으로 설정합니다.
5. 테마, 언어 등을 선택하고 생성된 코드를 복사합니다.
6. 복사한 설정 정보를 VitePress 코드에 반영합니다.

> `repo`, `repoId`, `category`, `categoryId` 값은 실제 저장소 설정에 맞게 입력해야 합니다.

---

## 3. 블로그 제목/설명/날짜 자동 표시

글마다 프론트매터로 설정한 `title`, `description`, `date` 정보를 본문 상단에 자동 표시하도록 레이아웃을 커스터마이징합니다. 아래는 `.vitepress/theme/CustomLayout.vue` 구성입니다:

```vue
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
```

---

## 4. 소개 페이지 구성

소개 페이지는 `/docs/about.md`, `/docs/about-me.md`에 각각 작성하며, 프론트매터에 `layout: doc`을 지정합니다.

또한 메인 페이지(`/docs/index.md`)에서는 `<RecentPosts />` 컴포넌트를 추가하고 `actions` 항목에 소개 페이지 링크를 연결합니다. 상단 메뉴는 `config.mjs`의 `themeConfig.nav`에 설정합니다:

```yaml
# index.md 중 일부
hero:
  actions:
    - theme: brand
      text: 블로그 소개
      link: /about
    - theme: alt
      text: 개발자 소개
      link: /about-me
```

```js
// config.mjs 중 일부
themeConfig: {
  nav: [
    { text: "Home", link: "/" },
    { text: "블로그 소개", link: "/about" },
    { text: "About Me", link: "/about-me" }
  ]
}
```

> 사용된 이미지 경로 설정은 7. 디렉토리 구조 및 이미지 관리에서 설명합니다.

---

## 5. 사이드바 자동 생성 설정

카테고리별 문서 구조에 따라 사이드바를 자동으로 생성하려면 `vitepress-sidebar` 플러그인을 사용합니다.

```bash
yarn add -D vitepress-sidebar
```

기본 설정 예시는 다음과 같습니다:

```js
import { defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';

const vitePressOptions = defineConfig({
  title: "之木",
  description: "기술 블로그",
  srcDir: "./docs",
});

const vitePressSidebarOptions = {
  documentRootPath: "/docs",
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
  collapsed: true,
};

export default withSidebar(vitePressOptions, vitePressSidebarOptions);
```

### 주요 옵션 설명

- `documentRootPath`: 사이드바에 포함할 Markdown 문서 루트 경로
- `useTitleFromFrontmatter`: 프론트매터의 제목(`title`)을 항목 이름으로 사용
- `useFolderTitleFromIndexFile`: 폴더 내 `index.md`의 제목을 폴더 이름 대신 사용
- `collapsed`: 하위 메뉴를 기본으로 접을지 여부 설정

---

## 6. 최신 글 표시 컴포넌트 구성

최신 글 목록은 `createContentLoader()`를 이용해 정렬된 결과를 가져옵니다.

```js
// .vitepress/theme/posts.data.mjs
export default createContentLoader("/posts/**/*.md", {
  transform(rawData) {
    return rawData
      .filter(post => post.frontmatter.layout === "doc" && typeof post.frontmatter.date === "string")
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
      .slice(0, 10);
  },
});
```

컴포넌트는 `.vitepress/theme/components/RecentPosts.vue`에 작성합니다:

```vue
<template>
  <div>
    <h2>최신 글</h2>
    <ul>
      <li v-for="post in posts" :key="post.url">
        <a :href="post.url">{{ post.frontmatter.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { data as posts } from '../posts.data.mjs';
</script>
```

메인 페이지(`/docs/index.md`)에서는 `<RecentPosts />`를 삽입해 최신 글을 표시합니다.

---

## 7. 디렉토리 구조 및 이미지 관리

```text
blog-root/
├── docs/
│   ├── index.md
│   ├── about.md
│   ├── about-me.md
│   ├── posts/
│   └── public/
│       └── images/
├── .vitepress/
│   ├── config.mjs
│   └── theme/
│       ├── index.js
│       ├── custom.css
│       ├── CustomLayout.vue
│       ├── posts.data.mjs
│       └── components/
│           └── RecentPosts.vue
└── package.json
```

이미지를 사용할 경우 `/docs/public/images/` 디렉토리에 저장하고 다음과 같이 참조합니다:

```md
![설명](/images/파일이름.png)
```

예: `![로고](/images/grigo-ico.png)`

---

## 마치며

지금까지 VitePress를 활용해 기술 블로그를 구축한 과정을 순차적으로 정리했습니다. Markdown 기반 작성, 레이아웃 확장, 댓글 기능, 최신 글 표시, 자동 사이드바 등 다양한 기능을 실용적으로 적용했습니다.

향후에는 태그 분류, 검색 기능, RSS 지원 등도 점진적으로 도입할 계획입니다.

---

📌 이 문서는 ChatGPT의 도움을 받아 초안 작성 및 교정을 진행하였습니다.

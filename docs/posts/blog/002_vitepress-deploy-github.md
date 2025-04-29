---
layout: doc
title: VitePress 기술 블로그 GitHub Pages 배포 기록
date: "2025-04-28T15:25:00"
description: VitePress로 제작한 기술 블로그를 GitHub Actions를 활용해 자동 배포하고, 커스텀 도메인까지 연결한 과정을 상세히 정리합니다.
comments: true
categories: [Blog]
tags: [CLI, Command, VitePress, Setting]
thumbnail: /images/thumbs/vitepress-deploy-github.png
---

## 🛫 시작하며

이전 글에서는 **VitePress**를 이용해 기술 블로그를 구축하는 과정을 소개했습니다. 이번 글에서는 구축한 블로그를 외부에 배포하는 방법을 정리합니다. **Netlify**, **Vercel** 등 다양한 배포 옵션을 검토했으나, 무료로 안정적인 운영이 가능한 **GitHub Pages**를 선택했습니다. 이미 GitHub 저장소는 준비된 상태이며, **GitHub Actions**를 활용한 자동 배포 설정, 배포 과정 중 발생한 문제와 해결 방법, 그리고 커스텀 도메인 연결까지 전 과정을 공유하고자 합니다.

---

## 1. GitHub Actions를 이용한 자동 배포 설정

**GitHub Actions**를 활용하면, 브랜치에 푸시할 때마다 자동으로 **VitePress** 사이트를 빌드하고 배포할 수 있습니다.

이번 프로젝트에서는 배포 전용 브랜치로 `publish` 브랜치를 새로 생성하여 사용했습니다. 워크플로우 파일은 다음과 같이 작성했습니다.

```yaml
# VitePress 사이트를 GitHub Pages에 빌드하고 배포하는 샘플 워크플로우
#
name: VitePress 사이트를 Pages에 배포

on:
  # `main` 브랜치를 대상으로 하는 푸시에서 실행됩니다. 기본 브랜치로 `master`를 사용하는 경우 여기를 `master`로 변경하세요.
  push:
    branches: [publish]

  # Actions 탭에서 이 워크플로우를 수동으로 실행할 수 있게 합니다.
  workflow_dispatch:

# GitHub Pages에 배포할 수 있도록 GITHUB_TOKEN의 권한을 설정합니다.
permissions:
  contents: read
  pages: write
  id-token: write

# 진행 중인 실행과 마지막으로 대기 중인 실행 사이에 대기 중인 실행을 건너뛰어 하나의 동시 배포만 허용합니다.
# 그러나 이러한 프로덕션 배포가 완료되도록 진행 중인 실행은 취소하지 않습니다.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 빌드 작업
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # lastUpdated가 활성화되지 않은 경우 필요하지 않음
      # - uses: pnpm/action-setup@v3 # pnpm을 사용하는 경우 주석 해제
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # Bun을 사용하는 경우 주석 해제
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: yarn # 또는 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: yarn install --frozen-lockfile # 또는 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: yarn docs:build # 또는 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  # 배포 작업
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 1-1. GitHub Pages 환경 설정

이 절차는 `publish` 브랜치를 배포용 브랜치로 설정하는 과정입니다. 기본값인 `master` 또는 `main` 브랜치를 사용하는 경우에는 이 단계를 건너뛰어도 됩니다.

#### 1단계: Environments 설정 화면 진입

📷![Environments 화면](/images/post/blog/vitepress-deploy-github/001.png)

- GitHub 저장소 **Settings** > **Environments**로 이동합니다.
- `github-pages` 환경을 선택합니다.

#### 2단계: 배포 브랜치 설정

📷![github-pages Configure 화면](/images/post/blog/vitepress-deploy-github/002.png)

- `github-pages` 환경 상세 설정 화면에서 `Deployment branches and tags` 영역까지 스크롤합니다.
- `새 브랜치 추가` 또는 기존 설정된 브랜치를 `수정`하거나 `삭제`할 수 있습니다.

---

## 2. 원격 저장소 연결

로컬 프로젝트를 GitHub 저장소에 연결하는 방법은 다음과 같습니다. (예시 저장소: `foo/bar`)

```bash
# 원격 저장소 추가
git remote add origin https://github.com/foo/bar.git

# 브랜치명을 publish로 변경
git branch -M publish

# 원격 저장소로 첫 푸시
git push -u origin publish
```

이후 변경사항은 `git push`만 해주면 **GitHub Actions**가 자동으로 배포를 수행합니다.

---

## 3. 발생한 문제점 및 해결 방법

### 3-1. 초기 Pages 설정 오류

**오류 메시지:**

```text
Error: Get Pages site failed. Please verify that the repository has Pages enabled...
Error: HttpError: Not Found
```

**원인:**
GitHub Pages 설정이 완료되기 전에 `.vitepress/dist` 폴더가 존재하지 않아 페이지 구성이 실패한 경우입니다.

**해결 방법:**
초기 워크플로우 설정에서 `Setup Pages` 단계를 주석 처리하고, 최초 빌드를 성공시킨 뒤 다시 설정을 복구했습니다.

### 3-2. 빌드 도구 설정 오류 (npm ci 실패)

**오류 메시지:**

```text
npm error The `npm ci` command can only install with an existing package-lock.json...
```

**원인:**
로컬에서는 `yarn`을 사용했지만, 복사해온 워크플로우에는 `npm ci`가 설정되어 있어 충돌이 발생했습니다.

**해결 방법:**
워크플로우 파일에서 의존성 설치 명령어를 `yarn install --frozen-lockfile`로 수정하여 해결했습니다.

### 참고: `base` 경로 설정 주의사항

GitHub Pages 기본 도메인(`foo.github.io/repo-name`)을 사용할 경우에는 반드시 `docs/.vitepress/config.js` 파일에 `base` 경로를 설정해야 정상적으로 사이트가 작동합니다.

```javascript
export default {
  base: '/repo-name/',
}
```

저는 커스텀 도메인을 사용할 예정이므로 별도로 설정하지 않았습니다.

---

## 4. GitHub Pages 설정

📷![Pages 화면](/images/post/blog/vitepress-deploy-github/003.png)

### 4-1. GitHub Pages 설정

- **Settings** > **Pages**에서 `Build and deployment` 영역의 `Source`를 `GitHub Actions`로 설정합니다.

여기까지 설정하면 GitHub에서 제공하는 기본 도메인으로 블로그를 서비스할 수 있습니다.
예를 들어, GitHub 계정이 `foo`이고, 블로그 저장소가 `bar`라면 `https://foo.github.io/bar`로 접근할 수 있습니다.
또는 저장소 이름을 계정명과 동일하게 설정하면 `https://foo.github.io/`로 서비스할 수 있습니다.

저는 별도로 사용하는 블로그용 도메인이 있어서, 이를 연결하는 절차를 추가로 진행했습니다.

### 4-2. Custom Domain 설정

- `Custom domain` 영역에서 원하는 도메인(예: `ligno.bud-it.com`)을 입력합니다.

#### DNS 설정

도메인 등록 기관에서 `CNAME` 레코드를 추가하여 자신의 GitHub Pages 도메인(예: `foo.github.io.`)을 연결합니다. 일부 기관에서는 마지막에 마침표(`.`)를 붙여야 할 수도 있습니다.

#### HTTPS 적용

DNS 설정이 완료되면 인증서 발급이 자동으로 진행됩니다. 발급 완료 후 `Settings > Pages`에서 **Enforce HTTPS** 옵션을 활성화하여 보안 연결을 적용합니다.

---

## 🏁 마무리

이번 글에서는 **VitePress**로 제작한 블로그를 **GitHub Pages**를 통해 자동 배포하고, 커스텀 도메인을 연결하는 전체 과정을 정리했습니다.

초기 설정만 안정적으로 완료해두면, 이후 글 작성 및 업데이트는 커밋과 푸시만으로 자동 반영되어 매우 편리하게 블로그를 운영할 수 있습니다.

---

📌 이 문서는 ChatGPT의 도움을 받아 초안 작성 및 교정을 진행했습니다.

import { defineConfig } from "vitepress";
import { generateSidebar, withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
// VitePress 설정
const vitePressOptions = defineConfig({
  title: "之木",
  description: "기술 블로그",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  srcDir: "./docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "개발자 소개", link: "/about-me" },
      { text: "블로그 소개", link: "/about" },
    ],

    // sidebar: [
    //   {
    //     text: "Ligno 기술 블로그",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    // ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});

// vitepress-sidebar 전용 옵션
const vitePressSidebarOptions = {
  documentRootPath: "/docs",
  // basePath: "/posts",
  useTitleFromFrontmatter: true,
  useFolderLinkFromIndexFile: true,
  useFolderTitleFromIndexFile: true,
  collapsed: true,
};

export default withSidebar(vitePressOptions, vitePressSidebarOptions);

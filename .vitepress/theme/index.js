// https://vitepress.dev/guide/custom-theme
import { h, toRefs } from "vue";
import DefaultTheme from "vitepress/theme";
import { useData, useRoute } from "vitepress";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import "./style.css";

import CustomLayout from "./CustomLayout.vue";
import RecentPosts from "./components/RecentPosts.vue";
import Partners from "./components/Partners.vue";
import "./custom.css";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   });
  // },
  Layout: CustomLayout,
  enhanceApp({ app, router, siteData }) {
    app.component("RecentPosts", RecentPosts);
    app.component("Partners", Partners);
  },
  setup() {
    const { frontmatter } = toRefs(useData());
    const route = useRoute();

    giscusTalk(
      {
        repo: "litlhope/ligno-tech",
        repoId: "R_kgDOOeLlOw",
        category: "Announcements",
        categoryId: "DIC_kwDOOeLlO84CpXsK",
        mapping: "pathname",
        inputPosition: "bottom",
        lang: "ko",
        lightTheme: "light",
        darkTheme: "transparent_dark",
        locales: {
          ko: "ko",
          "en-US": "en",
        },
        homePageShowComment: false,
      },
      {
        frontmatter,
        route,
      },
      true,
    );
  },
};

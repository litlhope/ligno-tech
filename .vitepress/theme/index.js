// https://vitepress.dev/guide/custom-theme
import { h, toRefs } from "vue";
import DefaultTheme from "vitepress/theme";
import { useData, useRoute } from "vitepress";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import "./style.css";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    const { frontmatter } = toRefs(useData());
    const route = useRoute();

    giscusTalk(
      {
        repo: "litlhope/litlcity",
        repoId: "R_kgDOJ1EBww",
        category: "Announcements",
        categoryId: "DIC_kwDOJ1EBw84CcL9w",
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

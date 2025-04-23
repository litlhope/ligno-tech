import { createContentLoader } from "vitepress";

export default createContentLoader("/posts/**/*.md", {
  transform(rawData) {
    return rawData
      .filter((post) => {
        const fm = post.frontmatter;
        return (
          fm.layout === "doc" &&
          typeof fm.date === "string" &&
          fm.type !== "page"
        );
      })
      .sort(
        (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date),
      );
  },
});

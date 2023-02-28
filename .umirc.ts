import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "yarn",
  proxy: {
    "/api": {
      target: "http://101.42.108.39:9999/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/hyl": {
      target: "https://www.hyl999.co:7777/",
      changeOrigin: true,
      pathRewrite: { "^/hyl": "" },
    },
  },
  mfsu: false,
  routes: [
    { path: "/", redirect: "/hot" },
    { path: "/hot", component: "./hot" },
    { path: "/artist", component: "./artist" },
    { path: "/search", component: "./search" },
  ],
  title: "小琳音乐站",
  outputPath: "hyl-music",
  links: [{ href: "/music.webp", rel: "icon" }],
});

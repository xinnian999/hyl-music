import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "yarn",
  proxy: {
    "/api": {
      target: "http://101.42.108.39:9999/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
  mfsu: false,
  routes: [
    { path: "/", redirect: "/hot" },
    { path: "/hot", component: "./hot" },
    { path: "/artist", component: "./artist" },
    { path: "/search", component: "./search" },
  ],
});

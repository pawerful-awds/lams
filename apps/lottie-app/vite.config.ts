import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "tailwindcss";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Lottie Animation Management System",
        short_name: "LAMS",
        description: "Lottie Animation Management System",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicons/favicon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicons/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "favicons/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "favicons/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});

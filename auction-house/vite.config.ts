import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/Sp2/",

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        register: resolve(__dirname, "register.html"),
        listing: resolve(__dirname, "listing.html"),
        profile: resolve(__dirname, "profile.html"),
        createListing: resolve(__dirname, "create-listings.html"),
      },
    },
  },
});
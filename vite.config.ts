import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        listing: resolve(__dirname, "listing.html"),
        login: resolve(__dirname, "auth/login.html"),
        register: resolve(__dirname, "auth/register.html"),
        profile: resolve(__dirname, "profile/index.html"),
        createListing: resolve(__dirname, "listings/create.html"),
        editListing: resolve(__dirname, "listings/edit.html"),
      },
    },
  },
});

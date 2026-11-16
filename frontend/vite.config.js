import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // While developing, every request that starts with /api is passed on to the backend.
    // The browser thinks the frontend and the backend are one website, so there are
    // no CORS problems and the login cookie works without extra settings.
    // The port must be the same as PORT in backend/.env
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
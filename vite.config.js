/**
 * Vite Configuration & Build Optimizer
 * 
 * Architectural Intent:
 * Configures the build pipeline and local development server for the Nirbhor Frontend.
 * 
 * Features:
 * - Tailwind v4 integration via `@tailwindcss/vite`.
 * - Backend Proxying: Routes `/api` and `/socket.io` to the local backend (Port 5001) 
 *   to bypass CORS issues during development.
 * - Dependency Optimization: Pre-bundles heavy packages (like recharts) to 
 *   speed up local server starts and resolve CommonJS/ESM module bridging issues.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Ensure recharts peer deps are pre-bundled by Vite's dep optimizer
  optimizeDeps: {
    include: ["react-is", "recharts"],
  },
  resolve: {
    // Prefer CJS builds where ESM is broken for these packages
    mainFields: ["module", "main"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.error("[Vite Proxy Error]:", err.message);
            if (res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: false,
                  error: {
                    code: "PROXY_ERROR",
                    message: "Backend server unavailable. Please try again.",
                  },
                }),
              );
            }
          });
        },
      },
      "/socket.io": {
        target: "http://localhost:5001",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

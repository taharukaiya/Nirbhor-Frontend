import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from 'url';
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '/cover': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
                headers: {
                    Referer: 'http://localhost:5173',
                    Origin: 'http://localhost:8081/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    Accept: 'application/json, text/plain, */*',
                },
            },
        },
    },
});

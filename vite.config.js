import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    server: {
        port: 3000,
        strictPort: true, // Fail if port is in use (Tauri expects exact port)
        open: false, // Tauri opens its own window
    },
    // Prevent vite from obscuring Rust errors
    clearScreen: false,
});

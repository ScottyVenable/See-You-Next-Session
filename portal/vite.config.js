import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/See-You-Next-Session/',
    build: {
        outDir: 'dist',
    },
    define: {
        'import.meta.env.VITE_DEV_PASSWORD_HASH': JSON.stringify(process.env.VITE_DEV_PASSWORD_HASH || ''),
        'import.meta.env.VITE_REPO_OWNER': JSON.stringify(process.env.VITE_REPO_OWNER || 'ScottyVenable'),
        'import.meta.env.VITE_REPO_NAME': JSON.stringify(process.env.VITE_REPO_NAME || 'See-You-Next-Session'),
    },
});

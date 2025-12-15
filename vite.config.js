import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

// Get git branch and commit hash for version string
function getGitVersion() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
        const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
        
        // Map branch names to release types
        const releaseType = branch === 'stable' ? 'release' : branch === 'develop' ? 'dev' : 'experimental';
        
        return `${releaseType}-${commit}`;
    } catch (e) {
        return 'unknown-build';
    }
}

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
    define: {
        __GAME_VERSION__: JSON.stringify(getGitVersion()),
    },
});

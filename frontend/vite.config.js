import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// GitHub Pages serves the site under /<repo-name>/, so the build needs that base path there.
const base = process.env.GITHUB_PAGES ? '/student-project-team-formation-portal/' : '/';
export default defineConfig({ base, plugins: [react()], server: { port: 5173, proxy: { '/api': 'http://localhost:8080' } } });

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            },
            // forward Auth requests (passport)
            '/login': 'http://localhost:3000',
            '/signup': 'http://localhost:3000',
            '/logout': 'http://localhost:3000',
            '/dashboard': 'http://localhost:3000'
        }
    }
});


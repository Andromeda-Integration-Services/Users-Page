import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true, // Fail if port 5173 is not available
    open: false // Don't auto-open browser (we'll handle this in bat file)
  },
  preview: {
    port: 5173,
    host: true,
    strictPort: true
  }
})

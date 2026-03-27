import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const repoRoot = path.resolve(__dirname, '..')
const frontendRoot = path.join(repoRoot, 'frontend')

export default defineConfig(({ mode }) => {
  // Merge root + frontend/.env so VITE_* can live in either place (envDir alone only loads one folder).
  const mergedEnv = {
    ...loadEnv(mode, repoRoot, ''),
    ...loadEnv(mode, frontendRoot, ''),
  }
  const apiProxyTarget = mergedEnv.VITE_DEV_API_PROXY || 'http://127.0.0.1:8000'

  const viteEnvDefine = Object.fromEntries(
    Object.entries(mergedEnv)
      .filter(([key]) => key.startsWith('VITE_'))
      .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value ?? '')]),
  )

  return {
    envDir: repoRoot,
    define: viteEnvDefine,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // With VITE_API_URL=/api, the browser hits the dev server; forward /api to FastAPI.
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})

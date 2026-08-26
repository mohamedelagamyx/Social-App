import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPages = process.env.VITE_GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages && repositoryName ? `/${repositoryName}/` : '/',
  server: {
    port: 5173,
  },
})

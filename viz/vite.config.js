import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // The base is specific to each vite MODE environment, since we are deploying to:
    // https://covidforecasting.brotmanbaty.org/forecasts-ncov-wa/index.html and
    // https://covidforecasting.brotmanbaty.org/forecasts-ncov-us-states/index.html
    base: env.VITE_URL_PATH_BASE,
    plugins: [react()],
  }
})

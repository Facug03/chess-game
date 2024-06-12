import dotenv from 'dotenv'
import { cleanEnv, host, num, port, str } from 'envalid'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname.slice(0, __dirname.indexOf('src')), '.env') })

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  HOST: host(),
  PORT: port(),
  CORS_ORIGIN: str(),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
  COMMON_RATE_LIMIT_WINDOW_MS: num(),
})

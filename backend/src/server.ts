import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import { pino } from 'pino'

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter'
import { chessRouter } from '@/api/chess/chessRouter'
import errorHandler from '@/common/middleware/errorHandler'
import rateLimiter from '@/common/middleware/rateLimiter'
import requestLogger from '@/common/middleware/requestLogger'
import { env } from '@/common/utils/envConfig'

const logger = pino({ name: 'server start' })
const app: Express = express()

// Set the application to trust the reverse proxy
app.set('trust proxy', true)

// Middlewares
const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((o: string) => o.trim())
  .filter(Boolean)
app.use(cors({ origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins, credentials: true }))
app.use(helmet())
app.use(rateLimiter)
app.use(express.json())

// Request logging
app.use(requestLogger)

// Routes
app.use('/health-check', healthCheckRouter)
app.use('/chess', chessRouter)

// Error handlers
app.use(errorHandler())

export { app, logger }

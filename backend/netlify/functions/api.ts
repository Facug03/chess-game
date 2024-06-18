import { app } from '../../src/server'

import serverless from 'serverless-http'

export const handler = serverless(app)

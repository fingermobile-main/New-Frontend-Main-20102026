import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import businessSuiteRoutes from './routes/business-suite.js'
import { initDatabase } from './db/database.js'
import { requestContext } from './middleware/request-context.js'
import { errorHandler } from './middleware/error-handler.js'
import { notFoundHandler } from './middleware/not-found.js'

dotenv.config()
initDatabase()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(requestContext)

app.use('/api', businessSuiteRoutes)

app.use(errorHandler)
app.use(notFoundHandler)

export default app

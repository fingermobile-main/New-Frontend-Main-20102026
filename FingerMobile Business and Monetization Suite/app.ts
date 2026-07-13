import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import businessSuiteRoutes from './routes/business-suite.js'
import './database.js' // Import database to initialize it
import { requestContext } from './request-context.js'
import { errorHandler } from './error-handler.js'
import { notFoundHandler } from './not-found.js'

dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(requestContext)

app.use('/api', businessSuiteRoutes)

app.use(errorHandler)
app.use(notFoundHandler)

export default app

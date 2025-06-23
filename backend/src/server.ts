import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import 'express-async-errors'

import logger from 'src/utils/logger'
import configs from './configs'
import errorParserMiddleware from './middlewares/error-parser'
import { routes } from './routes/routes'

const app = express()

app.use(express.json())

app.use(cors())

app.use(routes)

app.use(errorParserMiddleware)

app.listen(configs.serverPort, () =>
  logger.info(`Server is running in port ${configs.serverPort}`)
)

import { Router } from 'express'

const routes = Router()

routes.get('/healthcheck', (req, res) => { res.status(200) })

// Importing all the route modules

export { routes }

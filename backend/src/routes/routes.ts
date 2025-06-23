import { Router } from 'express';
import authRouter from './auth.routes';

const routes = Router()

routes.get('/healthcheck', (req, res) => { res.status(200).json() });

routes.use('/auth', authRouter);

export { routes };

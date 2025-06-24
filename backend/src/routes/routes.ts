import autenticationMiddleware from '@middlewares/authentication';
import { Router } from 'express';
import authRouter from './auth.routes';
import roleRouter from './role.routes';
import userRouter from './user.routes';

const routes = Router()

routes.get('/healthcheck', (req, res) => { res.status(200).json() });

routes.use('/auth', authRouter);

routes.use('/users', autenticationMiddleware, userRouter);

routes.use('/roles', autenticationMiddleware, roleRouter);

export { routes };

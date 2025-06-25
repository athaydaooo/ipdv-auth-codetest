import { SessionRepository } from '@repositories/session-repository';
import { LoginService } from '@services/auth/login-service/login-service';
import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { UserRepository } from '../repositories/user-repository';
import { LogoutService } from '../services/auth/logout-service/logout-service';
import { RefreshTokenService } from '../services/auth/refresh-token-service/refresh-token-service';

const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();

const loginService = new LoginService(userRepository, sessionRepository);
const logoutService = new LogoutService(sessionRepository);
const refreshTokenService = new RefreshTokenService(sessionRepository,userRepository);

const authController = new AuthController({
    loginService,
    logoutService,
    refreshTokenService,
});

const authRouter = Router();

authRouter.post('/login', authController.postLogin.bind(authController));
authRouter.post('/logout', authController.postLogout.bind(authController));
authRouter.post('/refresh', authController.postRefresh.bind(authController));

export default authRouter;
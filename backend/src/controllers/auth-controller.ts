import { loginSchema } from '@schemas/auth/login-schema';
import { logoutSchema } from '@schemas/auth/logout-schema';
import { refreshTokenSchema } from '@schemas/auth/refresh-token-schema';
import { LogoutService } from '@services/auth/logout-service/logout-service';
import { RefreshTokenService } from '@services/auth/refresh-token-service/refresh-token-service';
import { Request, Response } from 'express';
import { LoginService } from '../services/auth/login-service/login-service';

interface AuthControllerProps {
    loginService: LoginService;
    logoutService: LogoutService;
    refreshTokenService: RefreshTokenService;
}
    
export class AuthController {
    private loginService: LoginService;
    private logoutService: LogoutService;
    private refreshTokenService: RefreshTokenService;

    constructor(props: AuthControllerProps) {
        this.loginService = props.loginService;
        this.logoutService = props.logoutService;
        this.refreshTokenService = props.refreshTokenService;
    }

    /**
     * @route POST /api/auth/login
     * @description Autentica um usuário com email e senha.
     * @param {Object} req.body - Dados de autenticação do usuário.
     * @param {string} req.body.email - Email do usuário.
     * @param {string} req.body.password - Senha do usuário.
     * @returns {Object} 200 - Retorna o usuário autenticado, token de acesso e data de expiração.
     * @returns {Object} 401 - Credenciais inválidas.
     */
    async postLogin(request: Request, response: Response) {
        const { email, password } = loginSchema.parse(request.body);

        const user = await this.loginService.execute(email, password);
        
        return response.status(200).json(user);
    }

    /**
     * @route POST /api/auth/logout
     * @description Encerra a sessão do usuário autenticado.
     * @header {string} Authorization - Token JWT no formato Bearer.
     * @returns {void} 200 - Logout realizado com sucesso.
     * @returns {Object} 401 - Token inválido ou ausente.
     */
    async postLogout(request: Request, response: Response) {
        const { authorization } = logoutSchema.parse(request.headers);

        await this.logoutService.execute(authorization);

        return response.status(200).json();
    }

    /**
     * @route POST /api/auth/refresh
     * @description Gera um novo token de acesso usando um refresh token válido.
     * @param {Object} req.body - Dados para renovação do token.
     * @param {string} req.body.refreshToken - Refresh token válido.
     * @returns {Object} 200 - Retorna novo token de acesso e data de expiração.
     * @returns {Object} 401 - Refresh token inválido ou expirado.
     */
    async postRefresh(request: Request, response: Response) {
        const { refreshToken } = refreshTokenSchema.parse(request.body);

        const newToken = await this.refreshTokenService.execute(refreshToken);
        
        return response.status(200).json(newToken)
    }

}
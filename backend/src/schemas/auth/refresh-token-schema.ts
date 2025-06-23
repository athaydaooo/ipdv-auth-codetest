import { authInvalidRefreshToken, authMissingRefreshToken } from "@errors/auth";
import { jwtAuth } from "@utils/jwt";
import { z } from "zod";

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({
            required_error: `${authMissingRefreshToken.statusCode} |~| ${authMissingRefreshToken.message}`,
            invalid_type_error: `${authInvalidRefreshToken.statusCode} |~| ${authInvalidRefreshToken.message}`,
        })
        .min(1, `${authInvalidRefreshToken.statusCode} |~| ${authInvalidRefreshToken.message}`)
        .regex(
            jwtAuth.jwtRegex,
            `${authInvalidRefreshToken.statusCode} |~| ${authInvalidRefreshToken.message}`
        ),
});
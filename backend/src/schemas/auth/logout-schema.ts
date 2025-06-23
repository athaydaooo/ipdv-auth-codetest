import { authInvalidToken, authMissingToken } from "@errors/auth";
import { jwtAuth } from "@utils/jwt";
import { z } from "zod";

export const logoutSchema = z.object({
    authorization: z
        .string({
            required_error: `${authMissingToken.statusCode} |~| ${authMissingToken.message}`,
            invalid_type_error: `${authInvalidToken.statusCode} |~| ${authInvalidToken.message}`,
        })
        .min(1, "Authorization header is required")
        .transform((val) => {
            // Remove "Bearer " prefix if present
            if (val.startsWith("Bearer ")) {
                return val.slice(7).trim();
            }
            return val.trim();
        })
        .refine((token) => jwtAuth.jwtRegex.test(token), {
            message: `${authInvalidToken.statusCode} |~| ${authInvalidToken.message}`,
        }),
});

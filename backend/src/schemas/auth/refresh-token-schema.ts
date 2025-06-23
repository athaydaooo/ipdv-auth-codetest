import { jwtAuth } from "@utils/jwt";
import { z } from "zod";

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({
            required_error: "Refresh token is required",
            invalid_type_error: "Refresh token must be a string",
        })
        .min(1, "Refresh token cannot be empty")
        .regex(
            jwtAuth.jwtRegex,
            "Invalid JWT format for refresh token"
        ),
});
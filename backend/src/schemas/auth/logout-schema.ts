import { jwtAuth } from "@utils/jwt";
import { z } from "zod";

export const logoutSchema = z.object({
    authorization: z
        .string()
        .min(1, "Authorization header is required")
        .transform((val) => {
            // Remove "Bearer " prefix if present
            if (val.startsWith("Bearer ")) {
                return val.slice(7).trim();
            }
            return val.trim();
        })
        .refine((token) => jwtAuth.jwtRegex.test(token), {
            message: "Invalid JWT token format",
        }),
});

import { authInvalidEmail, authInvalidPassword, authMissingEmail, authMissingPassword } from "@errors/auth";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string({
        required_error: `${authMissingEmail.statusCode} |~| ${authMissingEmail.message}`,
        invalid_type_error: `${authInvalidEmail.statusCode} |~| ${authInvalidEmail.message}`,
    }).email({
        message: `${authInvalidEmail.statusCode} |~| ${authInvalidEmail.message}`,
    }),
    password: z.string({
        required_error: `${authMissingPassword.statusCode} |~| ${authMissingPassword.message}`,
        invalid_type_error: `${authInvalidPassword.statusCode} |~| ${authInvalidPassword.message}`,
    })
});
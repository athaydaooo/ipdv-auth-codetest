import {
    roleInvalidRoleId,
    roleMissingRoleId
} from "@errors/role";
import { z } from "zod";

export const getUserByIdParamsSchema = z.object({
    id: z.string({
        required_error: `${roleMissingRoleId.statusCode} |~| ${roleMissingRoleId.message}`,
        invalid_type_error: `${roleInvalidRoleId.statusCode} |~| ${roleInvalidRoleId.message}`,
    }),
});

export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>;

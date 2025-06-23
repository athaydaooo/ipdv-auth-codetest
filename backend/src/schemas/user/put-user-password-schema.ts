import { roleInvalidRoleIds, roleMissingRoleIds } from "@errors/role";
import { z } from "zod";

export const updateUserRolesSchema = z.object({
    roleIds: z.array(
        z.string({
            required_error: `${roleMissingRoleIds.statusCode} |~| ${roleMissingRoleIds.message}`,
            invalid_type_error:  `${roleInvalidRoleIds.statusCode} |~| ${roleInvalidRoleIds.message}`,
        })
    )
});

export type UpdateUserRolesBody = z.infer<typeof updateUserRolesSchema>;

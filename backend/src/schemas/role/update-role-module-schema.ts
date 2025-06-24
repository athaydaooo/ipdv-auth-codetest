import { roleInvalidArray, roleInvalidModuleIds, roleMissingArray, roleMissingModuleIds } from "@errors/role";
import { z } from "zod";

export const updateRoleModuleSchema = z.object({
    moduleIds: z.array(z.string({
        required_error: `${roleMissingModuleIds.statusCode} |~| ${roleMissingModuleIds.message}`,
        invalid_type_error: `${roleInvalidModuleIds.statusCode} |~| ${roleInvalidModuleIds.message}`,
    }), {
        required_error: `${roleMissingArray.statusCode} |~| ${roleMissingArray.message}`,
        invalid_type_error: `${roleInvalidArray.statusCode} |~| ${roleInvalidArray.message}`,
    }),
});
export type PutRoleModulesBody = z.infer<typeof updateRoleModuleSchema>;
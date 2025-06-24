import { AppError } from ".";

export const roleInvalidIsActive = new AppError(
    "Invalid isActive parameter",
    400,
);

export const roleInvalidRoleId = new AppError(
    "Invalid roleId parameter",
    400,
);

export const roleMissingIsActive = new AppError(
    "isActive parameter is missing",
    400,
);

export const roleMissingRoleId = new AppError(
    "roleId parameter is missing",
    400,
);

export const roleInvalidName = new AppError(
    "Invalid name parameter",
    400,
);

export const roleInvalidDescription = new AppError(
    "Invalid description parameter",
    400,
);

export const roleMissingDescription = new AppError(
    "description parameter is missing",
    400,
);

export const roleMissingName = new AppError(
    "name parameter is missing",
    400,
);

// Email errors
export const roleInvalidEmail = new AppError(
    "Invalid email parameter",
    400,
);

export const roleMissingEmail = new AppError(
    "email parameter is missing",
    400,
);

// Password errors
export const roleInvalidPassword = new AppError(
    "Invalid password parameter",
    400,
);

export const roleMissingPassword = new AppError(
    "password parameter is missing",
    400,
);

// RoleIds errors
export const roleInvalidRoleIds = new AppError(
    "Invalid roleIds parameter",
    400,
);

export const roleMissingRoleIds = new AppError(
    "roleIds parameter is missing",
    400,
);

export const roleNotFound = new AppError(
    "Role not found",
    400,
);


export const roleNameAlreadyExists = new AppError(
    "Role with this name already exists",
    400,
);

export const roleMissingModuleIds = new AppError(
    "moduleIds parameter is missing",
    400,
);

export const roleInvalidModuleIds = new AppError(
    "Invalid moduleIds parameter",
    400,
);

export const roleInvalidArray = new AppError(
    "This parameter must be an array",
    400,
);

export const roleMissingArray = new AppError(
    "This array should not be empty",
    400,
);


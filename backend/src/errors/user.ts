import { AppError } from ".";

export const userAlreadyExists = new AppError(
  "User Already Exists",
  400,
);

export const userNotEnoughtParameters = new AppError(
  "You must provide at least one parameter",
  400,
);
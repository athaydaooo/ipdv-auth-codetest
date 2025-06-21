import { AppError } from ".";

export const authInvalidToken = new AppError(
  "Invalid or expired token",
  401,
);

export const authMissingToken = new AppError(
  "Access token missing",
  401,
);
import { AppError } from ".";

export const authInvalidToken = new AppError(
  "Invalid or expired token",
  401,
);

export const authMissingToken = new AppError(
  "Access token missing",
  401,
);

export const authUserNotFound = new AppError(
  "User Not Found",
  400,
);

export const authSessionNotFound = new AppError(
  "Session Not Found",
  400,
);

export const authAlreadyRevokedSession = new AppError(
  "Already revoked session",
  400,
);



import { AppError } from ".";

export const authInvalidToken = new AppError(
  "Invalid or expired token",
  401,
);

export const authMissingToken = new AppError(
  "Access token missing",
  401,
);

export const authMissingRefreshToken = new AppError(
  "Refresh token missing",
  401,
);

export const authInvalidRefreshToken = new AppError(
  "Invalid token missing",
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

export const authSessionExpired = new AppError(
  "Session Expired",
  400,
);

export const authAlreadyRevokedSession = new AppError(
  "Already revoked session",
  400,
);


export const authRevokedSession = new AppError(
  "This Session is Revoked",
  400,
);

export const authInvalidCredentials = new AppError(
  "Invalid email or password",
  400,
);

export const authMissingEmail = new AppError(
  "Email parameter is missing",
  400,
);

export const authInvalidEmail = new AppError(
  "Invalid email parameter",
  400,
);

export const authMissingPassword = new AppError(
  "Password parameter is missing",
  400,
);

export const authInvalidPassword = new AppError(
  "Invalid password parameter",
  400,
);



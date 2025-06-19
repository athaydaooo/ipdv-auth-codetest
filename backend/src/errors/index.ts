export class AppError extends Error {
  public readonly message: string

  public readonly statusCode: number

  public readonly errorCode?: string

  constructor(message: string, statusCode = 400, errorCode?: string) {
    super(message)

    this.message = message
    this.statusCode = statusCode

    if (errorCode !== null) this.errorCode = errorCode
  }
}

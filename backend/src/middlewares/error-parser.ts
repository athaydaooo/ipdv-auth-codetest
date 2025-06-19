import { AppError } from '@errors/index'
import logger from '@util/logger'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const errorParserMiddleware = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error(err)

  if (err instanceof z.ZodError) {
    if (err.message.includes('|~|')) {
      return err.errors.map((err) => {
        const [errorCode, erroMessage, statusCode] = err.message.split(' |~| ')

        return response.status(statusCode ? Number(statusCode) : 400).json({
          code: errorCode,
          message: erroMessage,
        })
      })
    }

    return response.status(400).json({
      code: 400,
      message: err.message,
    })
  }

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      errCode: err.errorCode,
      message: err.message,
      statusCode: err.statusCode,
    })
  }

  return response.status(500).json({
    status: 'Error',
    message: 'Internal server error',
  })
}

export default errorParserMiddleware

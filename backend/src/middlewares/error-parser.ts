
import { AppError } from '@errors/index'
import logger from '@utils/logger'
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
          message: erroMessage,
        })
      })
    }
    else{
      logger.warn(err.message)
      return response.status(400).json({
        message: err.errors[0]?.message || 'Validation error',
      })
    }

  }

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    })
  }

  return response.status(500).json({
    message: 'Internal server error',
  })
}

export default errorParserMiddleware

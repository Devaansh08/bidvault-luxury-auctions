export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${statusCode} ${message}`, err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

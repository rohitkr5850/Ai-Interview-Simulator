export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with more details
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    status: err.status,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Groq API errors - provide user-friendly messages
  if (err.message && err.message.includes('Groq')) {
    error.message = err.message;
    // Rate limit errors
    if (err.message.includes('rate limit') || err.message.includes('429')) {
      error.statusCode = 429; // Too Many Requests
    } else {
      error.statusCode = 500;
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    errorCode: err.code || error.code,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err.message,
    }),
  });
};


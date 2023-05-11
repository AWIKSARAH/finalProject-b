export function handleErrors(err, req, res, next) {
  let statusCode, message;

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = err.message;
  }  else {
    // Handle all other errors
    statusCode = err.status || 500;
    message = err.message || 'Server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

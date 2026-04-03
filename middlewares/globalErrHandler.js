export default function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "An unexpected error occurred";

  console.error(err);
  res.status(statusCode).json({
    status,
    message,
  });
}

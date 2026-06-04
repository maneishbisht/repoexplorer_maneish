export default function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  if (status === 429) {
    return res.status(429).json({ error: message, code: 'RATE_LIMITED' });
  }

  if (status === 404) {
    return res.status(404).json({ error: message, code: 'NOT_FOUND' });
  }

  if (status === 403) {
    return res.status(403).json({ error: message, code: 'RATE_LIMITED' });
  }

  console.error(`[${status}] ${code}: ${message}`);
  res.status(status).json({ error: message, code });
}

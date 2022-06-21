const errorMiddleware = (err, req, res, next) => {
  if (err) return res.status(400).json({ message: 'Internal Server Error' });
  next();
};

module.exports = errorMiddleware;

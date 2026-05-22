const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: 'Unauthorized. Admin login required.'
    });
  }
  next();
};

module.exports = authMiddleware;

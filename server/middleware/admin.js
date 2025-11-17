const admin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error in admin middleware' });
  }
};

module.exports = admin;
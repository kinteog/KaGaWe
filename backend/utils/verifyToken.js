
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'You are not authorized.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    req.user = user;
    next(); // Only this is needed — no callback required anymore
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    // Allow all authenticated users through (like for POST /servicebooking)
    if (req.user) {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'You are not authorized.' });
    }
  });
};




export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'You are not authorized.' });
    }
  });
};

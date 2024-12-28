const jwt = require('jsonwebtoken');

// Replace with your secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET || "polymer_property_prediction";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the token is provided in the header
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // Attach the user information to the request object
    req.user = user;
    next(); // Pass the request to the next middleware or route handler
  });
};

module.exports = authenticateToken;

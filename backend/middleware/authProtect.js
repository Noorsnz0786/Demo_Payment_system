const jwt = require("jsonwebtoken"); // Ensure jwt is imported

const authProtect = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        msg: "Access denied! Please provide the token in the 'Authorization' header.",
      });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid, send an error response
    return res.status(401).json({ msg: "Invalid token! Please login again." });
  }
};

module.exports = { authProtect };

const jwt = require("express-jwt");

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", // info will be available in req.payload
  getToken: getTokenFromHeaders,
});

// extracting the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

// Export the middleware to be available to create protected routes
module.exports = {
  isAuthenticated,
};

module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs when the page is not available
    res.status(404).json({ errorMessage: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error and always logs the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      if (err.name === "UnauthorizedError") {
        res.status(401).json({ message: "Invalid Token!" });
      } else {
        res.status(500).json({
          errorMessage: "Internal server error. Check the server console.",
        });
      }
    }
  });
};

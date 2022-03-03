const router = require("express").Router();
const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const topicRoutes = require("./topic.routes");
const { isAuthenticated } = require("../middleware/jwt.middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);

router.use("/courses", courseRoutes);

router.use("/topics", topicRoutes);

module.exports = router;

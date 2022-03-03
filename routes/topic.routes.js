const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Topic = require("../models/Topic.model");
const Course = require("../models/Course.model");

router.post("/", isAuthenticated, (req, res) => {
  const { courseId } = req.body;
  // console.log(courseId);

  const topicDetails = {
    name: req.body.name,
    description: req.body.description,
    course: courseId,
  };

  Topic.create(topicDetails)
    .then((newTopic) => {
      return Course.findByIdAndUpdate(courseId, {
        $push: { topics: newTopic._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error creating a new topic", err);
      res.status(500).json({
        message: "error creating a new topic",
        error: err,
      });
    });
});

module.exports = router;
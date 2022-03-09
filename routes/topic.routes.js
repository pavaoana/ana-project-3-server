const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Topic = require("../models/Topic.model");
const Course = require("../models/Course.model");

router.get("/all", (req, res, next) => {
  Topic.find()
    .then((allTopics) => {
      res.json(allTopics);
    })
    .catch((err) => res.json(err));
});

router.post("/add", isAuthenticated, (req, res) => {
  const { courseId } = req.body;

  const topicDetails = {
    topicName: req.body.topicName,
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

router.get("/:topicId", (req, res, next) => {
  const { topicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    res.status(400).json({ message: "The specified topic id is not valid." });
    return;
  }

  Topic.findById(topicId)
    .then((topic) => res.json(topic))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;

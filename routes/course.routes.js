const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Course = require("../models/Course.model");
const mongoose = require("mongoose");

router.post("/create", isAuthenticated, (req, res) => {
  const courseDetails = {
    courseName: req.body.courseName,
    description: req.body.description,
    topics: [], // attention!
    image: req.body.image,
    location: req.body.location,
    duration: req.body.duration,
    schedule: req.body.schedule,
    careerServices: req.body.careerServices,
    jobGuaranteed: req.body.jobGuaranteed,
    preRequesites: req.body.preRequesites,
    cost: req.body.cost,
    link: req.body.link,
  };

  Course.create(courseDetails)
    .then((courseCreated) => {
      res.status(201).json(courseCreated);
    })
    .catch((err) => {
      console.log("Error creating a new course", err);
      res.status(500).json({
        message: "Error creating a new course",
        error: err,
      });
    });
});

router.get("/", (req, res, next) => {
  Course.find()
    .populate("topics")
    .then((allCourses) => res.json(allCourses))
    .catch((err) => res.json(err));
});

router.get("/:courseId", (req, res, next) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid." });
    return;
  }

  Course.findById(courseId)
    .populate("topics")
    .then((course) => res.json(course))
    .catch((err) => res.status(500).json(err));
});

router.put("/:courseId", isAuthenticated, (req, res, next) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid" });
    return;
  }

  const courseDetails = {
    courseName: req.body.courseName,
    description: req.body.description,
    topics: [], // attention!
    image: req.body.image,
    location: req.body.location,
    duration: req.body.duration,
    schedule: req.body.schedule,
    careerServices: req.body.careerServices,
    jobGuaranteed: req.body.jobGuaranteed,
    preRequesites: req.body.preRequesites,
    cost: req.body.cost,
    link: req.body.link,
  };

  Course.findByIdAndUpdate(courseId, courseDetails, { new: true })
    .then((updatedCourse) => res.json(updatedCourse))
    .catch((error) => res.status(500).json(error));
});

router.delete("/:courseId", isAuthenticated, (req, res, next) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid" });
    return;
  }

  Course.findByIdAndRemove(courseId)
    .then(() =>
      res.json({
        message: `The course ${courseId} was successfully deleted.`,
      })
    )
    .catch((error) => res.status(500).json(error));
});

module.exports = router;
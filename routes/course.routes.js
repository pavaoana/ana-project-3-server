const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Course = require("../models/Course.model");
const Topic = require("../models/Topic.model");
const mongoose = require("mongoose");

router.get("/all", (req, res, next) => {
  Course.find()
    //.populate("topics")
    .then((allCourses) => {
      console.log("allCourses:", allCourses);
      res.json(allCourses);
    })
    .catch((err) => res.json(err));
});

router.post("/add", isAuthenticated, (req, res) => {
  const courseDetails = {
    courseName: req.body.courseName,
    description: req.body.description,
    // topics: [], // attention!
    // image: req.body.image, // attention: load files
    // location: req.body.location,
    // duration: req.body.duration,
    // // schedule: req.body.schedule, // attention: enum
    // preRequesites: req.body.preRequesites,
    // cost: req.body.cost,
    // link: req.body.link,
  };

  Course.create(courseDetails)
    .then((courseCreated) => {
      console.log("courseCreated:", courseCreated);
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

router.get("/:courseId", (req, res, next) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid." });
    return;
  }

  Course.findById(courseId)
    //.populate("topics")
    .then((course) => res.json(course))
    .catch((err) => res.status(500).json(err));
});

router.put("/edit/:courseId", isAuthenticated, (req, res, next) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid" });
    return;
  }

  const courseDetails = {
    courseName: req.body.courseName,
    description: req.body.description,
    // topics: [], // attention!
    // image: req.body.image, // attention: load files
    location: req.body.location,
    duration: req.body.duration,
    schedule: req.body.schedule,
    preRequesites: req.body.preRequesites,
    cost: req.body.cost,
    link: req.body.link,
  };

  Course.findByIdAndUpdate(courseId, courseDetails, { new: true })
    //.then((updatedCourse) => res.json(updatedCourse))
    .then(() => res.json({ successMessage: "Success Message Hello" }))
    .catch((error) => res.status(500).json(error));
});

router.delete("/delete/:courseId", isAuthenticated, (req, res, next) => {
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

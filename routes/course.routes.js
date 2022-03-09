const router = require("express").Router();
const { isAuthenticated, user } = require("../middleware/jwt.middleware");
const Course = require("../models/Course.model");
const User = require("../models/User.model");
const Topic = require("../models/Topic.model");
const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config");

router.get("/all", (req, res, next) => {
  Course.find()
    .populate("topics")
    .populate("author")
    .then((allCourses) => {
      res.json(allCourses);
    })
    .catch((err) => res.json(err));
});

router.get("/my-courses", (req, res, next) => {
  Course.find()
    .populate("topics")
    .populate("author")
    .then((allCourses) => {
      res.json(allCourses);
    })
    .catch((err) => res.json(err));
});

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("image"), (req, res, next) => {
  // console.log("file is: ", req.file)
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  res.json({ fileUrl: req.file.path });
});

router.post("/add", isAuthenticated, (req, res) => {
  const topicsArr = [];

  for (const propertyName in req.body.selectedTopics) {
    if (req.body.selectedTopics[propertyName] === true) {
      topicsArr.push(propertyName);
    }
  }

  //const authorInfo = {}; // what

  const courseDetails = {
    courseName: req.body.courseName,
    description: req.body.description,
    topics: topicsArr,
    //image: req.file.path, // attention
    location: req.body.location,
    duration: req.body.duration,
    schedule: req.body.schedule,
    preRequisites: req.body.preRequisites,
    cost: req.body.cost,
    link: req.body.link,
    author: req.payload._id,
  };

  console.log("course details:", courseDetails);

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
    .populate("topics")
    .populate("author")
    .then((course) => res.json(course))
    .catch((err) => res.status(500).json(err));
});

router.put("/edit/:courseId", isAuthenticated, (req, res, next) => {
  const { courseId } = req.params;
  const topicsArr = [];

  for (const propertyName in req.body.selectedTopics) {
    if (req.body.selectedTopics[propertyName] === true) {
      topicsArr.push(propertyName);
    }
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid" });
    return;
  }

  const courseDetails = {
    courseName: req.body.courseName,
    description: req.body.description,
    topics: topicsArr,
    image: req.body.image,
    location: req.body.location,
    duration: req.body.duration,
    schedule: req.body.schedule,
    preRequisites: req.body.preRequisites,
    cost: req.body.cost,
    link: req.body.link,
    author: req.payload._id,
  };

  Course.findById(courseId).then((course) => {
    if (req.payload._id != course.author.toString()) {
      res
        .status(401)
        .json({ message: "Only the author of the course can update it." });
      return;
    }

    Course.findByIdAndUpdate(courseId, courseDetails, { new: true })
      //.then((updatedCourse) => res.json(updatedCourse))
      .then(() => res.json({ successMessage: "Course Updated!" }))
      .catch((error) => res.status(500).json(error));
  });
});

router.delete("/delete/:courseId", isAuthenticated, (req, res, next) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400).json({ message: "The specified course id is not valid" });
    return;
  }

  Course.findById(courseId).then((course) => {
    if (req.payload._id != course.author.toString()) {
      res
        .status(401)
        .json({ message: "Only the author of the course can delete it." });
      return;
    }

    Course.findByIdAndRemove(courseId)
      .then(() =>
        res.json({
          successMessage: `Course deleted!`,
        })
      )
      .catch((error) => res.status(500).json(error));
  });
});

module.exports = router;

const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please provide the name of the course."],
    },

    description: String,

    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],

    // image: String,

    location: {
      type: String,
      required: [true, "The course location is required."],
    },

    duration: {
      type: String,
      required: [true, "The duration of the course is required."],
    },

    schedule: {
      type: String,
      required: [true, "The time schedule of the course is required."],
    },

    preRequisites: String,

    cost: {
      type: Number,
      required: [true, "The cost of the course is required."],
    },

    link: {
      type: String,
      required: [true, "The link for the course is required."],
    },

    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Course", courseSchema);

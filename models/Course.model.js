const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please provide the name of the course."],
    },

    description: String,

    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],

    image: String,

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
      enum: ["Full-Time", "Part-Time", "Other"],
      required: [true, "You must select one option."],
    },

    careerServices: {
      type: Boolean,
      enum: ["Yes", "No"],
      required: [true, "This is a required field."],
    },

    jobGuaranteed: {
      type: String,
      enum: ["Yes", "Internship", "No"],
      required: [true, "This is a required field."],
    },

    preRequisites: String,

    cost: {
      type: Number,
      required: [true, "This is a required field."],
    },

    link: {
      type: String,
      required: [true, "This is a required field."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Course", courseSchema);

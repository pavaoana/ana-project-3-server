const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "This is a required field."],
    },

    description: String,

    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],

    image: Image,

    location: {
      type: String,
      required: [true, "This is a required field."],
    },

    duration: {
      type: String,
      required: [true, "This is a required field."],
    },

    schedule: {
      type: String,
      required: [true, "This is a required field."],
    },

    careerServices: {
      type: String,
      required: [true, "This is a required field."],
    },

    jobGuaranteed: {
      type: String,
      required: [true, "This is a required field."],
    },

    preRequisites: String,

    cost: {
      type: String,
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

const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "This is a required field."],
    },
    description: String,
    topics: { type: Schema.Types.ObjectId, ref: "Topic" }, // should it be inside an [] ?
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
      type: Boolean,
      required: [true, "This is a required field."],
    },
    jobGuaranteed: {
      type: Boolean,
      required: [true, "This is a required field."],
    },
    preRequisites: Boolean,
    isPayed: {
      type: Boolean,
      required: [true, "This is a required field."],
    },
    financing: {
      type: Boolean,
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

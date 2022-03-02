const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
  {
    nameOfTopic: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Topic", topicSchema);

const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
  {
    topicName: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Topic", topicSchema);

const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
  {
    topicName: {
      type: String,
      unique: true,
      required: [true, "Please provide a name for the topic you are creating."],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Topic", topicSchema);

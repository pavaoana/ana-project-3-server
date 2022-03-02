const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    organizationName: {
      type: String,
      required: [true, "The name of your Organization is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Your email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "A password is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);

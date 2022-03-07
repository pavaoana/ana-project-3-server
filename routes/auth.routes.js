const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "6h",
  });

  return authToken;
};

router.get("/loggedin", (req, res) => {
  res.json(req.user);
});

router.post("/signup", (req, res) => {
  const { organizationName, email, password } = req.body;

  if (!organizationName) {
    return res
      .status(400)
      .json({ message: "Please provide the name of your Organization." });
  }

  if (!email) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Your password needs to be at least 8 characters long.",
    });
  }

  // This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).json( {
      message:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the email submitted in the form
  User.findOne({ email }).then((found) => {
    if (found) {
      return res
        .status(400)
        .json({ message: "This email has already been registered." });
    }

    // If the user is not found, create a new user (start with hashing the password)
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          organizationName,
          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
        const authToken = generateToken(user);
        return res.json({ authToken: authToken });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            message:
              "The name needs to be unique. The name you chose is already in use.",
          });
        }
        return res.status(500).json({ message: error.message });
      });
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Please provide your email address." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: "Oops! Wrong email. Please try again." });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .json({ message: "Oops! Wrong password. Please try again." });
        }

        const authToken = generateToken(user);

        return res.json({ authToken: authToken });
      });
    })

    .catch((err) => {
      // sending the error handling to the error handling middleware
      next(err);
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json(req.payload);
});

module.exports = router;

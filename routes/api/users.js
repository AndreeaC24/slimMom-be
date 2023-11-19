const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/schemas/user");
require("dotenv").config();
const secret = process.env.SECRET;

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Users API!",
  });
});

//registration
router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body; 
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "Error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ name, email, password });
    const validationError = newUser.validateSync();
    console.log("Saved user in database:", newUser);
    if (validationError) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Bad Request. " + validationError.message,
        data: "Error",
      });
    }

    newUser.setPass(password);

    await newUser.save();

    res.status(201).json({
      status: "Success",
      code: 201,
      data: {
        message: "Registration successful",
        name: newUser.name,
        email: newUser.email, 
      },
    });
  } catch (error) {
    next(error);
  }
});

//login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isSamePass(password)) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email, 
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1w" });
    user.setToken(token);
    await user.save();

    res.json({
      status: "Success",
      code: 200,
      data: {
        token,
        user: {
          name: user.name,
          email: user.email, 
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        details: error.message,
      });
    } else {
      next(error);
    }
  }
});

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Not authorized",
        data: "Not authorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/contacts", auth, (req, res, next) => {
  const { email } = req.user;
  res.json({
    status: "Success",
    code: 200,
    data: {
      message: `Authorization was successful: ${email}`,
    },
  });
});

//logout
router.get("/logout", auth, async (req, res, next) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    } 
    user.setToken(null);
    await user.save(); 
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

//current
router.get("/current", auth, async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    res.status(200).json({
      name: currentUser.name,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

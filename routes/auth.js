const express = require("express");
const authRoutes = express.Router();
// Authentication
const passport = require("passport");
// Models
const User = require("../models/userModel");
// Encryption
const bcrypt = require("bcryptjs");

//----- Signup user
authRoutes.post("/api/auth/signup", (req, res) => {
  // Encrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // Create new user
      let newUser = new User({
        username: req.body.username,
        password: hash
      });

      // Save user
      newUser.save()
      .then(savedDoc => {
        res.json({ 
          success: true,
          user: savedDoc
        });
      })
      .catch(err => {
        console.log(err);
        res.json({ 
          success: false,
          message: "Username has been taken"
        });
      });
    });
  });
});

//----- Login user
authRoutes.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) next(err);

    // Invalid login
    if(!user) {
      res.json({
        success: false,
        message: info.message
      });
    } 

    // Successful login
    if(user) {
      req.logIn(user, err => {
        if(err) next(err);
        res.json({
          success: true,
          user
        });
      });
    }
  })(req, res, next);
});

//----- Logout user
authRoutes.post("/api/auth/logout", (req, res) => {
  req.logout(err => {
    if(err) console.log(err);
    res.json({ success: true });
  });
});

//----- Retrieve authenticated user
authRoutes.get("/api/auth/user", (req, res) => {
  if(req.user) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.json({
      success: false,
      message: "No active session"
    });
  }
});

module.exports = authRoutes;
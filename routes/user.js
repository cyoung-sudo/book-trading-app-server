const express = require("express");
const userRoutes = express.Router();
// Models
const User = require("../models/userModel");

userRoutes.route("/api/user")
//----- Retrieve users
.get((req, res) => {
  User.find({})
  .then(allDocs => {
    res.json({
      success: true,
      users: allDocs
    });
  })
  .catch(err => console.log(err));
});

userRoutes.route("/api/user/:id")
//----- Retrieve given user
.get((req, res) => {
  User.findById(req.params.id)
  .then(doc => {
    if(doc) {
      res.json({
        success: true,
        user: doc
      });
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      success: false,
      message: "Invalid userID"
    })
  });
});

module.exports = userRoutes;
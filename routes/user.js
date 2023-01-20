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

module.exports = userRoutes;
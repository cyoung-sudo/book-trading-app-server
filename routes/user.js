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
})
//----- Edit given user
.put((req, res) => {
  let updates = {};

  // **Needs to be optimized**
  if(req.body.fullName) {
    updates.fullName = req.body.fullName;
  }
  if(req.body.city) {
    updates.city = req.body.city;
  }
  if(req.body.state) {
    updates.state = req.body.state;
  }

  User.findByIdAndUpdate(req.params.id, updates, { 
    new: true 
  })
  .then(updatedDoc => {
    res.json({
      success: true,
      user: updatedDoc
    });
  })
  .catch(err => console.log(err));
})
//----- Delete given user
.delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
  .then(deletedDoc => {
    res.json({
      success: true,
      user: deletedDoc
    });
  })
  .catch(err => console.log(err));
});

module.exports = userRoutes;
const express = require("express");
const bookRoutes = express.Router();
// Models
const Book = require("../models/bookModel");

bookRoutes.route("/api/book")
//----- Create book
.post((req, res) => {
  let newBook = new Book({
    title: req.body.title,
    description: req.body.description,
    ownerUsername: req.body.ownerUsername,
    ownerId: req.body.ownerId
  });

  newBook.save()
  .then(savedDoc => {
    res.json({
      success: true,
      book: savedDoc
    });
  })
  .catch(err => console.log(err));
});

module.exports = bookRoutes;
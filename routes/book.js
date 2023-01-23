const express = require("express");
const bookRoutes = express.Router();
// Models
const Book = require("../models/bookModel");

bookRoutes.route("/api/book")
//----- Retrieve all books
.get((req, res) => {
  Book.find({})
  .then(allDocs => {
    res.json({
      success: true,
      books: allDocs
    });
  })
  .catch(err => console.log(err));
})
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

bookRoutes.route("/api/book/:userId")
//----- Retrieve all books for user
.get((req, res) => {
  Book.find({
    ownerId: req.params.userId
  })
  .then(docs => {
    res.json({
      success: true,
      books: docs
    });
  })
  .catch(err => console.log(err));
});

module.exports = bookRoutes;
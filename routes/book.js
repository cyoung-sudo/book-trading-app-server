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

bookRoutes.route("/api/book/:id")
//----- Update given book
.put((req, res) => {
  let updates = {
    ownerUsername: req.body.ownerUsername,
    ownerId: req.body.ownerId
  };

  Book.findByIdAndUpdate(req.params.id, updates, { 
    new: true 
  })
  .then(updatedDoc => {
    res.json({
      success: true,
      book: updatedDoc
    });
  })
  .catch(err => console.log(err));
})
//----- Delete given book
.delete((req, res) => {
  Book.findByIdAndDelete(req.params.id)
  .then(deletedDoc => {
    res.json({
      success: true,
      book: deletedDoc
    })
  })
  .catch(err => console.log(err));
});

bookRoutes.route("/api/book/user/:userId")
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
})
//----- Delete all books for given user
.delete((req, res) => {
  Book.deleteMany({
    ownerId: req.params.userId
  })
  .then(deletedCount => {
    res.json({
      success: true,
      count: deletedCount.deletedCount
    });
  })
  .catch(err => console.log(err));
});

module.exports = bookRoutes;
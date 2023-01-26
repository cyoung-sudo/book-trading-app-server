const express = require("express");
const tradeRoutes = express.Router();
// Models
const Trade = require("../models/tradeModel");

tradeRoutes.route("/api/trade")
//----- Retrieve all trades
.get((req, res) => {
  Trade.find({})
  .then(allDocs => {
    res.json({
      success: true,
      trades: allDocs
    });
  })
  .catch(err => console.log(err));
})
//----- Create trade
.post((req, res) => {
  let newTrade = new Trade({
    initiatorUsername: req.body.initiatorUsername,
    initiatorId: req.body.initiatorId,
    offer: req.body.offer,
    recipientUsername: req.body.recipientUsername,
    recipientId: req.body.recipientId,
    request: req.body.request
  });

  newTrade.save()
  .then(savedDoc => {
    res.json({
      success: true,
      trade: savedDoc
    });
  })
  .catch(err => console.log(err));
});

tradeRoutes.route("/api/trade/:id")
//----- Delete trade
.delete((req, res) => {
  Trade.findByIdAndDelete(req.params.id)
  .then(deletedDoc => {
    res.json({
      success: true,
      trade: deletedDoc
    });
  })
  .catch(err => console.log(err));
});

tradeRoutes.route("/api/trade/initiator/:userId")
//----- Retrieve all trades for given initiator
.get((req, res) => {
  Trade.find({
    initiatorId: req.params.userId
  })
  .then(allDocs => {
    res.json({
      success: true,
      trades: allDocs
    });
  })
  .catch(err => console.log(err));
});

tradeRoutes.route("/api/trade/recipient/:userId")
//----- Retrieve all trades for given recipient
.get((req, res) => {
  Trade.find({
    recipientId: req.params.userId
  })
  .then(allDocs => {
    res.json({
      success: true,
      trades: allDocs
    });
  })
  .catch(err => console.log(err));
});

tradeRoutes.route("/api/trade/deleteRelated/:bookId")
//----- Delete all trades related to given book
.delete((req, res) => {
  // Delete trades requesting given boook
  Trade.deleteMany({
    $or: [
      { "request.bookId": req.params.bookId },
      { "offer.bookId": req.params.bookId }
    ]
  })
  .then(deleteCount => {
    res.json({
      success: true,
      count: deleteCount
    });
  })
  .catch(err => console.log(err));
});

module.exports = tradeRoutes;
const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
  initiatorUsername: {
    type: String,
    required: true
  },
  initiatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  offer: {
    type: Array,
    required: true
  },
  recipientUsername: {
    type: String,
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  request: {
    type: Array,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Trade", TradeSchema);
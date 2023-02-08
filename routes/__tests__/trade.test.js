//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
const tradeRoutes = require("../trade");
// Data
const tradeTestData = require("../../data/tradeTestData");

//----- Middleware
app.use(express.json()); // needed to test POST requests
app.use("/", tradeRoutes);

//----- Routes
app.use(require("../trade"));

describe("----- Trade Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      const Trade = mongoose.model("Trade");
      // Clear initial data
      Trade.deleteMany({})
      // Insert test data
      .then(() => Trade.insertMany(tradeTestData.testTrades))
      .then(() => done())
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const Trade = mongoose.model("Trade");
    Trade.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done())
    .catch(err => console.log(err));
  }, 20000);

  describe("/api/trade", () => {
    //----- Test 1 -----
    it("(GET) successfully retrieves all trades", done => {
      request(app)
      .get("/api/trade")
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.trades).toBeDefined();
        expect(Array.isArray(res.body.trades)).toBe(true);
        expect(res.body.trades).toHaveLength(2);
        done();
      });
    });

    //----- Test 2 -----
    it("(POST) successfully creates a trade", done => {
      request(app)
      .post("/api/trade")
      .send({
        initiatorUsername: tradeTestData.testTrade.initiatorUsername,
        initiatorId: tradeTestData.testTrade.initiatorId,
        offer: tradeTestData.testTrade.offer,
        recipientUsername: tradeTestData.testTrade.recipientUsername,
        recipientId: tradeTestData.testTrade.recipientId,
        request: tradeTestData.testTrade.request
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.trade).toBeDefined();
        expect(typeof res.body.trade === 'object').toBe(true);
        expect(res.body.trade.initiatorUsername).toBe(tradeTestData.testTrade.initiatorUsername);
        expect(res.body.trade.initiatorId).toBe(tradeTestData.testTrade.initiatorId);
        expect(res.body.trade.offer).toStrictEqual(tradeTestData.testTrade.offer);
        expect(res.body.trade.recipientUsername).toBe(tradeTestData.testTrade.recipientUsername);
        expect(res.body.trade.recipientId).toBe(tradeTestData.testTrade.recipientId);
        expect(res.body.trade.request).toStrictEqual(tradeTestData.testTrade.request);
        done();
      });
    });
  });

  describe("/api/trade/:id", () => {
    //----- Test 3 -----
    it("(DELETE) successfully deletes a trade", done => {
      request(app)
      .delete(`/api/trade/${tradeTestData.testTrade._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.trade).toBeDefined();
        expect(typeof res.body.trade === 'object').toBe(true);
        expect(res.body.trade._id).toBe(tradeTestData.testTrade._id);
        done();
      });
    });
  });

  describe("/api/trade/initiator/:userId", () => {
    //----- Test 4 -----
    it("(GET) successfully retrieves all trades for given initiator", done => {
      request(app)
      .get(`/api/trade/initiator/${tradeTestData.testTrades[0].initiatorId}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.trades).toBeDefined();
        expect(Array.isArray(res.body.trades)).toBe(true);
        expect(res.body.trades).toHaveLength(1);
        done();
      });
    });
  });

  describe("/api/trade/recipient/:userId", () => {
    //----- Test 5 -----
    it("(GET) successfully retrieves all trades for given recipient", done => {
      request(app)
      .get(`/api/trade/recipient/${tradeTestData.testTrades[0].recipientId}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.trades).toBeDefined();
        expect(Array.isArray(res.body.trades)).toBe(true);
        expect(res.body.trades).toHaveLength(1);
        done();
      });
    });
  });

  describe("/api/trade/deleteRelated/:bookId", () => {
    //----- Test 6 -----
    it("(DELETE) successfully deletes all trades related to given book", done => {
      request(app)
      .delete(`/api/trade/deleteRelated/${tradeTestData.testTrades[0].offer[0].bookId}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBeDefined();
        expect(typeof res.body.count).toBe("number")
        expect(res.body.count).toBe(1);
        done();
      });
    });
  });
});
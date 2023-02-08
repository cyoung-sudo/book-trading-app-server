//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
const bookRoutes = require("../book");
// Data
const bookTestData = require("../../data/bookTestData");
const userTestData = require("../../data/userTestData");

//----- Middleware
app.use(express.json()); // needed to test POST requests
app.use("/", bookRoutes);

//----- Routes
app.use(require("../book"));

describe("----- Book Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      const Book = mongoose.model("Book");
      // Clear initial data
      Book.deleteMany({})
      // Insert test data
      .then(() => Book.insertMany(bookTestData.testBooks))
      .then(() => done())
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const Book = mongoose.model("Book");
    Book.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done())
    .catch(err => console.log(err));
  }, 20000);

  describe("/api/book", () => {
    //----- Test 1 -----
    it("(GET) successfully retrieves all books", done => {
      request(app)
      .get("/api/book")
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.books).toBeDefined();
        expect(Array.isArray(res.body.books)).toBe(true);
        expect(res.body.books).toHaveLength(3);
        done();
      });
    });

    //----- Test 2 -----
    it("(POST) successfully creates a book", done => {
      request(app)
      .post("/api/book")
      .send({
        title: bookTestData.testBook.title,
        description: bookTestData.testBook.description,
        ownerUsername: bookTestData.testBook.ownerUsername,
        ownerId: bookTestData.testBook.ownerId
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.book).toBeDefined();
        expect(typeof res.body.book === 'object').toBe(true);
        expect(res.body.book.title).toBe(bookTestData.testBook.title);
        expect(res.body.book.description).toBe(bookTestData.testBook.description);
        expect(res.body.book.ownerUsername).toBe(bookTestData.testBook.ownerUsername);
        expect(res.body.book.ownerId).toBe(bookTestData.testBook.ownerId);
        done();
      });
    });
  });

  describe("/api/book/:id", () => {
    //----- Test 3 -----
    it("(PUT) successfully updates given book", done => {
      request(app)
      .put(`/api/book/${bookTestData.testBook._id}`)
      .send({
        ownerUsername: userTestData.testUser2.username,
        ownerId: userTestData.testUser2._id
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.book).toBeDefined();
        expect(typeof res.body.book === 'object').toBe(true);
        expect(res.body.book.ownerUsername).toBe(userTestData.testUser2.username);
        expect(res.body.book.ownerId).toBe(userTestData.testUser2._id);
        done();
      });
    });

    //----- Test 4 -----
    it("(DELETE) successfully deletes a book", done => {
      request(app)
      .delete(`/api/book/${bookTestData.testBook._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.book).toBeDefined();
        expect(typeof res.body.book === 'object').toBe(true);
        expect(res.body.book._id).toBe(bookTestData.testBook._id);
        done();
      });
    });
  });

  describe("/api/book/user/:userId", () => {
    //----- Test 5 -----
    it("(GET) successfully retrieves all books for given user", done => {
      request(app)
      .get(`/api/book/user/${bookTestData.testBook._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.books).toBeDefined();
        expect(Array.isArray(res.body.books)).toBe(true);
        expect(res.body.books).toHaveLength(1);
        done();
      });
    });

    //----- Test 6 -----
    it("(DELETE) successfully deletes all books for given user", done => {
      request(app)
      .delete(`/api/book/user/${bookTestData.testBook._id}`)
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
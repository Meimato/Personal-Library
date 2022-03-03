/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    // User Story #1 - You can send a POST request to /api/books with title as part of the
    // form data to add a book. The returned response will be an object with the title and
    // a unique _id as keys. If title is not included in the request, the returned response
    // should be the string missing required field title.
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books/")
            .send({
              title: 'La Fondazione'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200, "Response status should be 200");
              assert.property(res.body, "title", "Book should contain title");
              assert.property(res.body, "_id", "Book should contain _id");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function (err, res) {
              assert.equal(res.status, 200, "Response status should be 200");
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    // User Story #2 - You can send a GET request to /api/books and receive a JSON response
    // representing all the books. The JSON response will be an array of objects with each
    // object (book) containing title, _id, and commentcount properties.
    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200, "Response status should be 200");
            assert.isArray(res.body, "Response body should be an array");
            assert.property(res.body[0], "title", "Books should have a title");
            assert.property(res.body[0], "_id", "Books should have an ID");
            assert.property(
              res.body[0],
              "commentcount",
              "Books should have a counter"
            );
            done();
          });
      });
    });

    // User Story #3 - You can send a GET request to /api/books/{_id} to retrieve a single
    // object of a book containing the properties title, _id, and a comments array (empty
    // array if no comments present). If no book is found, return the string no book exists.
    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/123456787654321")
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            const randomBookIndex = Math.floor(Math.random() * res.body.length);
            chai
              .request(server)
              .get("/api/books/" + res.body[randomBookIndex]._id)
              .end(function (err, data) {
                assert.equal(data.status, 200, "Response status should be 200");
                assert.property(
                  data.body,
                  "title",
                  "Books should have a title"
                );
                assert.property(data.body, "_id", "Books should have an ID");
                done();
              });
          });
      });
    });

    // User Story #4 - You can send a POST request containing comment as the form
    // body data to /api/books/{_id} to add a comment to a book. The returned response
    // will be the books object similar to GET /api/books/{_id} request in an earlier
    // test. If comment is not included in the request, return the string missing
    // required field comment. If no book is found, return the string no book exists.
    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/")
            .send({
              title: "Il Sole Nudo"
            })
            .end(function (err, res) {
              chai
                .request(server)
                .post("/api/books/" + res.body._id)
                .send({
                  comment: "EPICO!",
                })
                .end(function (err, data) {
                  assert.equal(data.body._id, res.body._id);
                  assert.equal(data.body.comments[0], 'EPICO!');
                  done();
                });
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post("/api/books/")
            .send({
              title: "Abissi d'Acciaio"
            })
            .end(function (err, res) {
              chai
                .request(server)
                .post("/api/books/" + res.body._id)
                .send({})
                .end(function (err, data) {
                  assert.equal(data.text, "missing required field comment");
                  done();
                });
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/88888888888888")
            .send({ comment: "This book does not exist." })
            .end(function (err, res) {
              assert.equal(res.body.error, "no book exists");
              done();
            });
        });
      }
    );

    // User Story #5 - You can send a DELETE request to /api/books/{_id} to delete a book
    // from the collection. The returned response will be the string delete successful if
    // successful. If no book is found, return the string no book exists.
    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .post("/api/books/")
          .send({
            title: "I Robots dell'alba"
          })
          .end(function (err, res) {
            chai
              .request(server)
              .delete("/api/books/" + res.body._id)
              .end(function(err, data) {
                assert.equal(data.body.message, 'delete successful');
                done();
              });
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/88888888888888")
          .end(function(err, res) {
            assert.equal(res.body.error, 'no book exists');
            done();
          });
      });
    });
  });
});

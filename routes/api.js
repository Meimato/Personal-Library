/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");
const Book = require("../models/Book");
const BookSchema = require("../models/Book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookSchema.find({}).then((data) => {
        res.json(data);
      });
    })

    .post(function (req, res) {
      if (!req.body.title) {
        return res.send("missing required field title");
      }

      const book = new BookSchema({
        title: req.body.title,
      });

      if (mongoose.connection.readyState === 1) {
        book.save().then((el) => {
          return res.status(200).json(el);
        });
      }
    })
    // User Story #6 - You can send a DELETE request to /api/books to delete all books in
    // the database. The returned response will be the string 'complete delete successful
    // if successful.
    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      BookSchema.deleteMany({})
        .then(() => res.json({ message: "complete delete successful" }))
        .catch(() => res.json({ error: "could not delete books" }));
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookSchema.find({ _id: bookid })
        .then((book) => {
          res.json({
            title: book[0].title,
            _id: bookid,
            comments: book[0].comments
          });
        })
        .catch(() => res.send("no book exists"));
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }

      BookSchema.find({ _id: bookid })
        .then((book) => {
          const myComments = [...book[0].comments];
          myComments.push(comment);
          const myQuery = {
            comments: myComments,
            commentcount: myComments.length,
          };
          BookSchema.findByIdAndUpdate(bookid, myQuery).then(() => {
            BookSchema.find({ _id: bookid }).then((result) => {
              return res.json({
                title: result[0].title,
                _id: bookid,
                comments: result[0].comments
              });
            });
          });
        })
        .catch((err) => res.json({ error: "no book exists" }));
      /* 
      BookSchema.find({ _id: bookid }, function(err, data) {
        const myComments = [...data[0].comments];
        myComments.push(comment)
        const myQuery = {
          comments: myComments
        }
        BookSchema.findByIdAndUpdate(bookid, myQuery, function(err, datag) {
          if (err) {
            res.json(err)
          }
          console.log(datag)
          res.json(datag);
        });
      }) */
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookSchema.findByIdAndDelete(bookid)
        .then(() => {
          res.json({ message: "delete successful" });
        })
        .catch(() => res.json({ error: "no book exists" }));
    });
};

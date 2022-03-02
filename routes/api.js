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
        const myResult = [];
        for (let i = 0; i < data.length; i++) {
          myResult.push({
            _id: data[i]._id,
            title: data[i].title,
            commentcount:
              Object.getOwnPropertyNames(data[i].comments).length - 1,
          });
        }
        res.json(myResult);
      });
    })

    .post(function (req, res) {
      if (!req.query.title) {
        return res.send("missing required field title");
      }

      const book = new BookSchema({
        title: req.query.title,
      });

      if (mongoose.connection.readyState === 1) {
        book.save().then((el) => {
          res.status(200).json({
            _id: el._id,
            title: el.title,
          });
        });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookSchema.find({ _id: bookid })
        .then((book) => {
          res.json(book);
        })
        .catch(() => res.send("no book exists"));
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      BookSchema.find({ _id: bookid }, function(err, data) {
        console.log(data)
        const myComments = [...data[0].comments];
        console.log(myComments)
        const myQuery = {
          comments: myComments.push(comment)
        }
        console.log(myQuery.comments)
        BookSchema.findByIdAndUpdate({ _id: bookid }, myQuery, function(err, datag) {
          res.json(datag);
        });
      })
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};

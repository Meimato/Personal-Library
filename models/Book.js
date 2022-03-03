const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, require: true },
  comments: { type: [String] },
  commentcount: { type: Number, default: 0 }
});

module.exports = mongoose.model('bookSchema', bookSchema);
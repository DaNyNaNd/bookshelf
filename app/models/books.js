const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BookSchema = new Schema({
  title: String,
  author: String
})

module.exports = mongoose.model('Book', BookSchema)

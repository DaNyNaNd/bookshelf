const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views', __dirname + '\\app')

// connect to the Mongo db
// TODO
mongoose.connect('mongodb://localhost:27017/bookshelf')
const Book = require('./app/models/books')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// ROUTES FOR OUR API
let router = express.Router()

// use for all requests
// here, we could add authentication checking for specific routes
router.use((req, res, next) => {
  console.log('Something is happening.')
  next()
})

// test route to make sure everything is working
router.get('/', (req, res) => {
  res.json({ message : 'hooray! welcome to our api!' })
})

// more routes here

// for routes that end in /books
router.route('/books')
  // POST route for /books
  .post((req, res) => {
    let book = new Book()
    book.title = req.body.title
    book.save((err) => {
      if(err)
        res.send(err)

      res.redirect('/api/books')
    })
  })
  // GET route for /books
  .get((req, res) => {
    Book.find((err, books) => {
      if(err)
        res.send(err)

      //res.json(books)
      res.render('./views/pages/books', {
        books: books
      })
    })
  })

// for routes that end in /books/:book_id
router.route('/books/:book_id')
// GET the book with the id specified
.get((req, res) => {
  Book.findById(req.params.book_id, (err, book) => {
    if(err)
      res.send(err)

    res.json(book)
  })
})
// PUT update the book with specified id
.put((req, res) => {
  Book.findById(req.params.book_id, (err, book) => {
    if(err)
      res.send(err)

    book.title = req.body.title

    book.save((err) => {
      if(err)
        res.send(err)

      res.json({ message : 'Book updated!' })
    })
  })
})
// DELETE a book by id
.delete((req, res) => {
  Book.remove({
    _id: req.params.book_id
  }, (err, book) => {
    if(err)
      res.send(err)

    res.json({ message : 'Successfully deleted!' })
  })
})

// REGISTEER
// all routes will be prefixed with /api
app.use('/api', router)


app.listen(PORT, () => {
  console.log('Server active and listening on port ' + PORT)
})

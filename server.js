const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/app');

// connect to the Mongo db
// TODO
mongoose.connect('mongodb://localhost:27017/bookshelf');
const Book = require('./app/models/books');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Include static files in the resources directory
app.use(express.static('./app/resources'));

// ROUTES FOR OUR API
let router = express.Router();

// use for all requests
// here, we could add authentication checking for specific routes
router.use((req, res, next) => {

  next();
});

// test route to make sure everything is working
router.get('/', (req, res) => {
  res.render('./views/pages/welcome');
});

// more routes here
router.route('/add')
  .get((req, res) => {
    res.render('./views/pages/add');
  });

// for routes that end in /books
router.route('/books')
  // POST route for /books
  .post((req, res) => {
    let book = new Book();
    book.title = req.body.title;
    book.author = req.body.author;
    book.save((err) => {
      if(err)
        res.send(err);

      res.redirect('/books');
    });
  })
  // GET route for /books
  .get((req, res) => {
    Book.find((err, books) => {
      if(err)
        res.send(err);

      //res.json(books)
      res.render('./views/pages/books', {
        books: books
      });
    });
  });

// for routes that end in /books/:book_id
router.route('/books/:book_id')
// GET the book with the id specified
.get((req, res) => { // add Book profile page
  Book.findById(req.params.book_id, (err, book) => {
    if(err)
      res.send(err);

    res.render('./views/pages/book', {
      book: book
    });
  });
})
// Update the book with specified id
.post((req, res) => { // update from Book profile page
  Book.findById(req.params.book_id, (err, book) => {
    if(err)
      res.send(err);

    // DELETE a book if the delete button is pressed
	if(req.body._method == 'delete') {
	  Book.remove({
        _id: req.params.book_id
      }, (err, book) => {
        if(err)
          res.send(err);

       // res.json({ message : 'Successfully deleted!' })
	   res.redirect('/books');
   });
	} else { // update the book with the given information
      book.title = req.body.title;
      book.author = req.body.author;

      book.save((err) => {
        if(err)
          res.send(err);
        // res.json({ message: 'Successfully updated!' })
        res.redirect('/books');
      });
	}
});
});

// REGISTER

app.use(router);


app.listen(PORT, () => {
  console.log('Server active and listening on port ' + PORT);
})

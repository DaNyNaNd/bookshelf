const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = require("./app/router")


app.set('view engine', 'ejs');
app.set('views', __dirname + '/app');

// connect to the Mongo db
mongoose.connect('mongodb://localhost:27017/bookshelf')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Include static files in the resources directory
app.use(express.static('./app/resources'));

// REGISTER router
app.use(router)

app.listen(PORT, () => {
  console.log('Server active and listening on port ' + PORT);
})

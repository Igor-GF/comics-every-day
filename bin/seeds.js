const mongoose = require('mongoose');
const ComicBook = require('../models/ComicBook.model');

const someComicBooks = [{
  title: "The Dark Knight Returns",
  writer: "Frank Miller",
  publisher: 'DC Comics',
  cover: '',
  rates: []
},{
  title: "Watchmen",
  writer: "Alan Moore",
  publisher: 'DC Comics',
  cover: '',
  rates: []
},{
  title: "Sin City",
  writer: "Frank Miller",
  publisher: 'Dark Horse Comics',
  cover: '',
  rates: []
}]

mongoose
  .connect('mongodb://localhost/comics-every-day', {
    userCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)

    ComicBook.create(someComicBooks)
    .then(resCreateSeeds => {
      console.log(`Seeds created: ${resCreateSeeds.length}`);

      mongoose.connection.close();
    })
    .catch(seedsError => console.error(`ERROR creating seeds: ${seedsError}`))
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
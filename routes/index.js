const express = require('express');
const { populate } = require('../models/ComicBook.model');
const router  = express.Router();
const ComicBook = require("../models/ComicBook.model");

router.get("/", (req, res) => {
  const { user } = req;

  ComicBook.find({})
  .then((rslFindComics) => {

    res.status(200).render("index", { user, comics: rslFindComics, message: req.flash('message')})
  })
  .catch( findComicsErr => {
    console.error(findComicsErr);
  })
});

module.exports = router;
const { Router } = require('express');
const router = new Router();
const Review = require("../models/Review.model");
const ComicBook = require("../models/ComicBook.model");

router.get('/comics/:comicId/review', (req, res) => {
  const { comicId } = req.params;
  
  res.status(200).render('reviews/add', { user: req.user });
});

router.post('/comics/:comicId/review', (req, res, next) => {
  const { comicId } = req.params;
  const{ rate, comment } = req.body;
  const{ user } = req;
  const rateNumber = parseInt(rate);

  Review.create( {owner: user._id, rate: rateNumber, comment} )
  .then((rslReview) => {

    ComicBook.findById(comicId)
    .then( rslComic => {
      rslComic.rates.push(rslReview);
      return rslComic.save();
    })
    .then((rslComicSaved) => {
      
      res.redirect('/');
    })
    .catch( err => console.error(err));
  })
  .catch((createReviewErr) => next(createReviewErr));
});

module.exports = router;
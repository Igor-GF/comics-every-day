const express = require('express');
const router  = express.Router();
const ComicBook = require("../models/ComicBook.model");
const upLoadCover = require("../configs/cloudinary.config");


router.get("/add-comic-book",(req, res) => {
  const { user } = req;

  res.status(200).render("comics/add", { user, messageAddComics: req.flash('message')});
});


router.post("/add-comic-book", upLoadCover.single("coverUrl"), (req, res, next) => {
  const { title, writer, publisher } = req.body;
  const { path } = req.file;
  
  if (!title || !writer) {
    res.status(200).render("comics/add", { messageAddComics: 'Title and Writer are required!'});
    return;
  }

    ComicBook.findOne({ title })
    .then((rslComicBookFound) => {
      if (rslComicBookFound){

        req.flash( `message`, `${rslComicBookFound.title} is already created! Click on All Comics to find it!`);
        res.redirect("/add-comic-book");
      return;
      }
    
    ComicBook.create({ title, writer, publisher, coverUrl: path })
    .then((rslComicBook) => {
      
      res.redirect(`/comics/${rslComicBook.id}`)
    })
    .catch( addComicsErr => next(addComicsErr))
  })
  .catch(err => next(err));
});


router.get("/comics/:comicId", (req, res, next) => {
  const { comicId } = req.params;
  let userReviewedThis = false;
  let comicTotalRating;

  ComicBook.findById(comicId)
  .populate({ path: 'rates', model: 'Review' })
  .then((rslComicFound) => {
    
    rslComicFound.rates.forEach((userRate) => {
      
      if(userRate) {
        
        if(userRate.owner.equals(req.user._id)) {
          userReviewedThis = true;
        }
      }
    });

    // comicTotalRating = userRate.reduce((acc, rates) => {
    //   acc + rates.rate;
    // }, 0);

    // console.log(`TOTAL`, comicTotalRating);

    res.status(200).render("comics/comicBook", { user: req.user, comicBook: rslComicFound, userReviewedThis, comicTotalRating, messageAddedWishList: req.flash('message') });
  })
  .catch(findComicError => next(findComicError))
});

router.get("/comics/:comicId/edit", (req, res, next) => {
  const { comicId } = req.params;

  ComicBook.findById(comicId)
  .then((rslComicBook) => {
    
    res.status(200).render("comics/edit", { user: req.user, comicBook: rslComicBook });
  })
  .catch( updateError => next(updateError))
});


router.post("/comics/:comicId/edit", upLoadCover.single("coverUrl"), (req, res, next) => {
  const { comicId } = req.params;
  const { title, writer, publisher, existingCover } = req.body;
  
  let cover;

  if(req.file) {
    const { path } = req.file;

    cover = path
  } else {
    cover = existingCover
  }

  ComicBook.findByIdAndUpdate(comicId, { title, writer, publisher, coverUrl: cover })
  .then((rslComicUpdate) => {
    
    res.redirect(`/comics/${comicId}`);
  })
  .catch( updateError => next(updateError))
});


router.post("/comics/:comicId/delete", upLoadCover.single("coverUrl"), (req, res, next) => {
  const { comicId } = req.params;
  
  ComicBook.findByIdAndDelete(comicId)
  .then((rslDeleted) => {
    
    req.flash( `message`, `${rslDeleted.title} was deleted!`);
    res.redirect("/profile");
  })
  .catch( updateError => next(updateError))
});

module.exports = router;
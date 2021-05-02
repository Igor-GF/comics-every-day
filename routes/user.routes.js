const { Router } = require('express');
const router = new Router();
const User = require("../models/User.model");
const ComicBook = require("../models/ComicBook.model");

router.get('/profile', (req, res) => {
  const { user } = req;
  
  res.status(200).render('users/profile', { user, message: req.flash('message') });
});

router.post('/comics/:comicId/add-wish-list', (req, res, next) => {
  const { comicId } = req.params;
  const { user } = req;

  ComicBook.findById(comicId)
  .then((rslComicFound) => {
        
    user.wishedComics.push(rslComicFound); 
    user.populate("wishedComics").save();

    req.flash( `message`, `${rslComicFound.title} was added to your Wish List!`);
    res.redirect(`/comics/${comicId}`);
  })
  .catch(err => next(err));
})

router.post("/profile/:userId/delete", (req, res, next) => {
  const { userId } = req.params;
  
  User.findByIdAndDelete(userId)
  .then((rslUserDeleted) => {
    
    req.flash( `message`, `${rslUserDeleted.username} was deleted!`);
    res.redirect("/");
  })
  .catch( updateError => next(updateError))
});

module.exports = router;
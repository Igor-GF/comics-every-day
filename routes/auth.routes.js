const { Router } = require('express');
const router = new Router();
const passport = require('passport');
const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const upLoadCover = require("../configs/cloudinary.config");

router.get("/login", (req, res) => {
  res.render("auth/login", { errorMessage: req.flash("error")});
})

router.post(
  "/login", 
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/signup", (req, res) => {
  const { user } = req;

  res.status(200).render("auth/signup", { user });
})

router.post("/signup", upLoadCover.single("profilePicUrl"), (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400).render("auth/signup", { errorMessage: "Please, all fields need to be filled up."})
    return;
  }

  User.findOne({ email })
  .then((rslUserFound) => {
    if (rslUserFound){
      res.status(400).render("auth/signup", { errorMessage: "This email is already registered."})
    return;
    }

    bcrypt.hash(password, 10)
    .then((passwordHash) =>{
      return User.create({ username, email, password: passwordHash, profilePicUrl: req.file.path })
    })
    .then((newUser) => {
      req.login(newUser, (err) => {
        if (err) {
          res.status(500).render("auth/signup", { errorMessage: "Login failed after signing up."});
        }
        res.status(200).redirect("profile");
      });
    })
    .catch( hashError => next(hashError));
  })
  .catch((errorFindUser) => {
    next(errorFindUser);
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

module.exports = router;
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

// sign up route
router.post(
  "/signup",
  [
    check("name", "Name should be atleast 3 chars").isLength({ min: 3 }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be atleast 3 chars").isLength({
      min: 3,
    }),
  ],
  signup
);

// sign in route
router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password feild is required").isLength({
      min: 1,
    }),
  ],
  signin
);

// sign out route
router.get("/signout", signout);

//
router.get("/testRoute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;

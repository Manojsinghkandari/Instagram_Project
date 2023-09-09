const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Sign up");
});

module.exports = router;

const express = require("express");
const { createLike } = require("../controller/LikesController");
const{userAuth} = require("../Controller/authentication");
const router = express.Router();

router.post("/add",userAuth, createLike);

module.exports = router;

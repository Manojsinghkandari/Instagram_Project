const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,"./posts");
  },
  filename: function(req,file,cb){
    let fileName=Date.now().toString() + "." + file.originalname.split(".")[1] ;
    req.fileName = fileName;
    cb(null, fileName);
  }
})
const upload = multer({storage : storage});

const{createPost,getTagsList,getfeed,postDelete} = require("../controller/PostsController");
const{userAuth} = require("../Controller/authentication");

router.post("/createPost",userAuth, upload.array("Post",10), createPost);
router.get("/tags",userAuth, getTagsList);
router.get("/feed",userAuth, getfeed);
router.delete("/Delete",userAuth, postDelete);


module.exports = router;













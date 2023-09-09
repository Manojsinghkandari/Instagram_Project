const express = require("express");
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  followUser,
  acceptRequest,
  rejectRequest,
  getRequests,
  changeprofileType,
} = require("../controller/UserController");
const{userAuth,} = require("../Controller/authentication");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,"./posts");
  },
  filename: function(req,file,cb){
    let fileName=Date.now().toString() + "." + file.originalname.split(".")[1] + ".jpg";
    req.fileName = fileName;
    cb(null, fileName);
  }
})
const upload = multer({storage : storage});



router.post("/createUser",upload.single("file"),createUser);
router.post("/userLogin",(req,res,next)=>{console.log("userLogin"); next()},loginUser);
router.put("/updateUser",userAuth, updateUser);
router.delete("/deleteUser",userAuth, deleteUser);
router.post("/follow", userAuth,followUser);
router.post("/accept",userAuth, acceptRequest);
router.post("/reject", userAuth,rejectRequest);
router.get("/requests", userAuth,getRequests);
router.put("/change", userAuth,changeprofileType);

module.exports = router;

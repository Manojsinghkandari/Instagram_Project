const jwt = require("jsonwebtoken");

const secret = "myProfile";

const userAuth = async (req,res,next)=>{
  let token = req.headers.authorization;
  if(token){
    token = token.split(" ")[1];
    console.log(token)
  }
  try{
    const user = jwt.verify(token,secret);
    req.user = user;
    // res.send("user exist")
    next();
  }
  catch (err) {
        console.log(err);
        // res.send("ineternal err")
      }
}

module.exports = {userAuth}
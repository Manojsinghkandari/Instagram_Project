const bcrypt = require("bcrypt");

const jwt=require("jsonwebtoken");

const secret="myProfile";

const User = require("../model/UserModel");

const createUser = async (req, res) => {
  try {
    const { username, password, email, phone_number, bio, gender } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const profilePicture = "/Image/" + req.fileName;
    // console.log(profilePicture);
    console.log({
      username,
      password: hashPassword,
      email,
      phone_number,
      bio,
      gender,
        profilePicture,
    });
    const userinfo = new User({
      username,
      password: hashPassword,
      email,
      phone_number,
      bio,
      gender,
        profilePicture,
    });

    console.log(userinfo);
    const data = await userinfo.save();
    console.log(data);
    res.send("User Created Successfully");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};


const loginUser = async(req,res)=>{
  const {email,password}= req.body;
  try{
  const user = await User.findOne({email:email});
  if(user){
    console.log(user)
    const passMatch = await bcrypt.compare(password , user.password)
    if(passMatch){
      const token = jwt.sign({email, username : user.username},secret);
      res.send({token});
    } else{
      res.status(400).send("Password is Incorrect");
    }
  }else{
    res.status(404).send("user doesn't exist");
  }
}catch(err){
  console.log(err);
  // res.status(404).send("user doesn't exist");
}
}

const updateUser = async(req,res)=>{
  try{
  let user = await User.findOne({email:req.body.email});
  if(user){
    const comparePhonenumber = await User.find({phone_number:user.phone_number});
    user = await User.findOneAndUpdate({email:req.body.email},{phone_number : req.body.newphone_number});
    res.send("newphone_number changed successfully");
    console.log(user)
  }
}catch(err){
  console.log(err);
  // res.send(err);
}
}

const deleteUser = async(req,res)=>{
  try{
  const user = await User.findOne({email:req.body.email})
  if(user){
    await User.findOneAndDelete()
    res.send("user deleted successfully");
  }else{
    res.send("user doesn't exist");
  }
}
catch(err){
  console.log(err);
  // res.send("internal error")
}
}

const changeprofileType=async(req,res)=>{

  try{
    
    let user = await User.findOne({email:req.body.email});

  if(user){
      if(user.publicProfile !== false);

      let publicProfile="false"
      await User.findOneAndUpdate(
        {email:req.body.email},{
          publicProfile: publicProfile
        });
    }
    
      res.send("Profile changed successfully");
  }catch(err){
    console.log(err);
}
};

const followUser = async (req, res) => {
  try {
    // 1. get targetUser
    const targetUser = await User.findOne({ username: req.body.targetUser });
    console.log(targetUser);
    const targetUserId = targetUser._id;

    // 2. get currentUser
    // 2. a) get the current user's username from the token
    let username=req.user.username;
    console.log(req.user);
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    // res.send(currentUserId)

    // 3. target users profile is public
    if (targetUser.publicProfile) {
      // 4. currentUser is not blocked by targetUser
      if (!targetUser.blockedUsers.includes(currentUserId)) {
        // 5. currentUser is not already following the targetUser
        if (!targetUser.followers.includes(currentUserId)) {
          // 6. currentUser is not the targetUser
          if (currentUserId !== targetUserId) {
            // 7. add currentUser to targetUser's followers array
            targetUser.followers.push(currentUserId);
            // 8. add targetUser to currentUser's following
            currentUser.following.push(targetUserId);
            // 9. save both users
            await targetUser.save();
            await currentUser.save();
            res.send("User followed successfully");
          } else {
            res.send("You can't follow yourself");
          }
        } else {
          res.send("You are already following the user");
        }
      } else {
        res.send("You are blocked by the user");
      }
    } else {
      // If the target user's profile is private

      // 4. currentUser is not blocked by targetUser
      if (!targetUser.blockedUsers.includes(currentUserId)) {
        // 5. currentUser is not already following the targetUser
        if (!targetUser.followers.includes(currentUserId)) {
          // 6. currentUser is not the targetUser
          if (currentUserId !== targetUserId) {
            // 7. add currentUser to targetUser's followers array
            targetUser.requests.push(currentUserId);
            // 9. save both users
            await targetUser.save();
            res.send("You have requested to follow the user.");
          } else {
            res.send("You can't follow yourself");
          }
        } else {
          res.send("You are already following the user");
        }
      } else {
        res.send("You are blocked by the user");
      }
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};


const getRequests = async (req, res) => {
  try {
    // get the current user's username from the token
   let username=req.user.username;
    console.log(req.user);
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;

    if (currentUser.requests.length === 0) {
      res.send("No requests found");
    } else {
      let requests = [];
      for (let i = 0; i < currentUser.requests.length; i++) {
        let request = await User.findOne({ _id: currentUser.requests[i] });
        requests.push({
          username: request.username,
          id: request._id,
          profilePicture: request.profilePicture,
        });
      }
      res.send(requests);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const acceptRequest = async (req, res) => {
  try {
    // 1. current user details
    let username=req.user.username;
    console.log(req.user);
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    // 2. target user details
    const targetUser = await User.findOne({ username: req.body.targetUser });
    const targetUserId = targetUser._id;
    // 3. check if the current user has a request from the target user
    if (currentUser.requests.includes(targetUserId)) {
      // 4. remove the target user from the current user's requests array
      currentUser.requests.splice(
        currentUser.requests.indexOf(targetUserId),
        1
      );
      // 5. add the current user to the target user's followers array
      currentUser.followers.push(targetUserId);
      // 6. add the target user to the current user's following array
      targetUser.following.push(currentUserId);
      // 7. save both users
      await currentUser.save();
      await targetUser.save();
      res.send("Request accepted successfully");
    } else {
      res.send("No request found for this user");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const rejectRequest = async (req, res) => {
  try {
    // 1. current user details
    let username=req.user.username;
    console.log(req.user);
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    // 2. target user details
    const targetUser = await User.findOne({ username: req.body.targetUser });
    const targetUserId = targetUser._id;
    // 3. check if the current user has a request from the target user
    if (currentUser.requests.includes(targetUserId)) {
      // 4. remove the target user from the current user's requests array
      currentUser.requests.splice(
        currentUser.requests.indexOf(targetUserId),
        1
      );
      // 5. save both users
      await currentUser.save();
      res.send("Request rejected successfully");
    } else {
      res.send("No request found for this user");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const unfollowUser = async (req, res) => {
  // same as followUser but remove the user from the followers and following array
  try{
  ///////// 1. getting user username and ID /////////////
  const currentUser = await User.findOne({username:req.user.username})
  const currentID = currentUser._id;
  console.log(currentUser.publicProfile)
  ///////// 2. getting targetUser username and ID /////////////
  const targetUser = await User.findOne({username: req.body.targetUser});
  const targetID = targetUser._id;
 console.log(targetUser.publicProfile)
  // if(targetID.publicProfile === "false"){
  //   console.log(targetID.publicProfile);

  /////// 3. currentUser is not blocked by targetUser////////
    if(!targetUser.blockedUsers.includes(currentUser)){
  ////// 4. currentUser is not already following the targetUser/////
     if(!targetUser.followers.includes(currentUser)){
  ///// 5. currentUser is not the targetUser ////////////      
      if(currentUser !== targetUser){
  ///// 6. remove currentUser to targetUser's followers array /////////      
        currentUser.followers.pop(targetUser);
        res.send("unfollowed targetUser successsfully");
        await currentUser.save();
        }else{
          res.send("targetUser is not equal to currentUser")
        }
      }else{
        res.send("targetUser is not a follower of currentUser")
      }
    }else{
     res.send("targetUser is not blocked by currentUser")
      }
  }catch(err){
    console.log(err);
    res.send(err);
  }
};


const blockUser = async (req, res) => {
  // same as followUser but add the user to the blockedUsers array
  // also remove from followers and following array
  try{
// 1. get targetUser
const targetUser = await User.findOne({username : req.body.targetUser})
const targetID = targetUser._id ; 
// 2. get the current user's username from the token
const currentUser = await User.findOne({username : req.user.username})
const currentID = currentUser._id ;
// 3. target users profile is public
// if(targetUser.publicProfile){
// 4. currentUser is not blocked by targetUser
if(!currentUser.blockedUsers.includes(targetID)){
// 5. currentUser is not already following(followers) the targetUser
// if(!currentUser.followers.includes(targetID)){
// 6. currentUser is not the targetUser
if(currentUser !== targetUser){
  currentUser.blockedUsers.push(targetID);
  currentUser.followers.splice(currentUser.followers.indexOf(targetID),1)
  currentUser.following.splice(currentUser.following.indexOf(targetID),1)

  targetUser.followers.splice(targetUser.followers.indexOf(currentID),1)
  targetUser.following.splice(targetUser.following.indexOf(currentID),1)
  await currentUser.save();
  await targetUser.save();
  res.send("targetUser blocked successfully");
} 
// }
}
}
catch(err){
  console.log(err);
  res.send(err);
}
};

const unblockUser = async (req, res) => {
  // remove from the blockedUsers array
   try{
  const currentUser = await User.findOne({username : req.user.username});
  const currentID = currentUser._id;
  const targetUser = await User.findOne({username : req.body.targetUser});
  const targetID = targetUser._id;
  if(!targetUser.blockedUsers.includes(currentID)){
    // if(!targetUser.followers.includes(currentID)){
      if(currentUser !== targetUser){
        currentUser.blockedUsers.pop(targetUser);
        await currentUser.save();
        res.send("unblocked target user successfully");
      }
    // }
  }
}catch(err){
  console.log(err);
  res.send(err)
}
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  followUser,
  acceptRequest,
  rejectRequest,
  getRequests,
  changeprofileType,
  unfollowUser,
  blockUser,
  unblockUser
};

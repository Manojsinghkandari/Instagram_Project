const Post = require("../model/PostsModel");
const User = require("../model/UserModel");

const createPost = async (req, res) => {
  try {
    // 1. get the current user
    let username=req.user.username;
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    const postUrl = "/Image/" + req.fileName;

    // 2. create a new post
    let newPost = new Post({
      userId: currentUserId,
      caption: req.body.caption,
      //   use multer to upload the media file
      mediaUrl: postUrl,
      musicUrl: req.body.musicUrl,
      location:req.body.location,
      tags: req.body.tags, // ["64e37cc66174a12f34c084fc", "64e37cc66174a12f34c084fc"]
    });
    // 3. save the post
    await newPost.save();
    res.send("Post created successfully");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// api to get all music
const getAllMusic = async (req, res) => {
  // list of music which is available
  // let music = [
  //     "music1.mp3",
  //     "music2.mp3",
  //     "music3.mp3",
  // ]
};

const getTagsList = async (req, res) => {
  try {
    // 1. get the current user from the token
    let username=req.user.username;
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    // 2. get all users from following and followers array
    let users = currentUser.following.concat(currentUser.followers);
    users = users.map((user) => {
      // userIds would be in ObjectID format so we need to convert it to string
      return user.toString();
    });
    // 3. remove duplicate users
    let uniqueUsers = [...new Set(users)];
    // 4. get all the details of the users
    //we are having the user ID,

    let userData = await User.find({ _id: { $in: uniqueUsers } });
    userData = userData.map((user) => {
      return {
        username: user.username,
        id: user._id,
      };
    });
    // 5. send the details of the users back to the frontend

    res.send(userData);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getfeed = async (req, res) => {
  try {
    // 1. get the current user (get from the token)
    let username=req.user.username;
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    //  2. get all the users from following array
    // 4. sort the posts based on createdAt
    let followingPosts = await Post.find({
      userId: { $in: currentUser.following },
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .lean();
    // // get user information
    // followingPosts.forEach(async (post) => {
    //   let user = await User.findOne({ _id: post.userId });
    //   post.username = user.username;
    // });
    // 5. send the posts back to the frontend

    res.send(followingPosts);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const postDelete = async(req,res)=>{
  const currentUser = await userModel.findOne({username : req.user.username})
  const userID = currentUser._id;
  console.log(userID);
  const postID = await User.find({postID : req.body.postID})
  if(postID){
   const deletePost =  await User.findOneAndDelete()
    res.send("post Deleted successfully")
  }
}



module.exports = {
  createPost,
  getTagsList,
  getfeed,
  postDelete,
};

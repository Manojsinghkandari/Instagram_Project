const User = require("../model/UserModel");
const Likes = require("../model/LikesModel");

const createLike = async (req, res) => {
  try {
    // get the current user from the token
    let username=req.user.username;
    const currentUser = await User.findOne({ username:username});
    const currentUserId = currentUser._id;
    // get the post id from the request body
    let postId = req.body.postId;
    // check if the post is already liked by the user
    let isLiked = await Likes.findOne({
      userId: currentUserId,
      postId: postId,
    });
    if (isLiked) {
      res.send("Post already liked");
    } else {
      // create a new like
      let newLike = new Likes({
        userId: currentUserId,
        postId: postId,
      });
      // save the like
      await newLike.save();
      let counter = await countLikes(postId);
      res.send(
        "Post liked successfully and no. of likes on the post are: " + counter
      );
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const countLikes = (postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const likes = await Likes.find({ postId: postId }).lean();
      resolve(likes.length);
    } catch (error) {
      reject(error);
    }
  });
};

const removeLike = async (req, res) => {
  // 1. get current user from token
  // 2. get post id from request body
  // 3. check if the post is already liked by the user by checking the likes collection
  // a) run  a query to find the like by userId and postId
  // b) if the like is found, delete the like
};

module.exports = {
  createLike,
};

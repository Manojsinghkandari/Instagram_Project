const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Posts",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const Likes = mongoose.model("Likes", likesSchema);

module.exports = Likes;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  caption: {
    type: String,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  musicUrl: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const Posts = mongoose.model("Posts", postsSchema);

module.exports = Posts;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Posts",
  },
  comment: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;

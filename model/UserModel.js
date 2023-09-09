const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  username: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  phone_number: {
    type: Number,
    unique: true,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  publicProfile: {
    type: Boolean,
    default: true,
  },
  // followers: {
  //     type: Array,
  // },
  // following: {
  //     type: Array,
  // }
});

const Users = mongoose.model("Users", usersSchema);
Users.createIndexes();

module.exports = Users;

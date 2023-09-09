const express = require("express");
const app = express();
const port = 3001;

// const bodyParser = require("body-parser");
app.use(express.json());

const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/";
const dbName = "instagram";

mongoose
  .connect(url + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const userRouter = require("./router/user");
const likesRouter = require("./router/likes");
const postsRouter = require("./router/posts");
app.use("/user", userRouter);
app.use("/likes", likesRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

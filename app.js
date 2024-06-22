require("dotenv").config();

const path = require("path");
const express = require("express");
const userRoute = require('./routes/user');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require('./models/blog');

const blogRoute = require('./routes/blog');

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
//To deploy we need a dynamic port as we dont know whicg port is free at that time
//console.log("My name is ", process.env.myname);
const PORT = process.env.PORT || 8000;

mongoose
  //.connect('mongodb://127.0.0.1:27017/Blog-kit')
  .connect(process.env.MONGO_URL)
  .then((e)=> console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve('./public'))) //public folder mein jo bhi hai use statistically serve kardo

app.get("/", async(req, res) =>{
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=>console.log(`Server Started at Port: ${PORT}`));
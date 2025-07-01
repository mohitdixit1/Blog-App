require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Connection error:", err));


// Middleware for static files
app.use(express.static(path.resolve("./public")));
app.use('/uploads', express.static('public/uploads')); // Serve uploaded profile images

// Parse form data & JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser for authentication
app.use(cookieParser());

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Authentication middleware
const { cheackForAuthCookie } = require("./middlewares/authentication");
app.use(cheackForAuthCookie("token"));

// Route imports
const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");
const Blog = require("./models/blog");

// Route mounting
app.use("/user", UserRoute);
app.use("/blog", BlogRoute);

// Home page
app.get("/", async (req, res) => {
  if (!req.cookies.token) {
    return res.redirect("/user/signin");
  }

  try {
    const AllBlog = await Blog.find().sort({ createdAt: -1 }); // Latest blogs first
    return res.render("home", {
      user: req.user,
      AllBlog,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong while loading the homepage.");
  }
});

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 App is running at http://localhost:${PORT}`);
});

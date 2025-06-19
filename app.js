
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path")
app.use(express.static(path.resolve("./public")));


const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog")
const Blog = require("./models/blog")

const cookieParser = require("cookie-parser")
const {cheackForAuthCookie} = require("./middlewares/authentication")
const mongoose = require('mongoose');



const PORT = process.env.PORT ||7000;





mongoose.connect( process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("Connection error:", err));


app.set("view engine" , "ejs")
app.set("views",path.resolve("./views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cheackForAuthCookie("token"));
app.use("/user",UserRoute);
app.use("/blog",BlogRoute);
app.use(express.static(path.resolve("./public")))

app.get("/",async (req,res)=>{
    const AllBlog = await Blog.find().sort({ createdAt: -1 });  // Newest first
;
    if(!req.cookies.token){return res.redirect("/user/signin")
    }
    res.render("home",{
        user:req.user,
        AllBlog:AllBlog,
    })

})
app.listen(PORT,()=>{
    console.log(`app is listening at port ${PORT}`)
})
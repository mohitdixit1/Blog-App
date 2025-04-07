const {Router} = require("express");
const User = require("../models/user");

const router = Router();

 router.get("/signin",(req,res)=>{
    res.render("signin");
 })
 router.get("/signup",(req,res)=>{
    res.render("signup");
 })

router.post("/signin" ,async (req,res)=>{
   const {email,password} = req.body;
   try {
      
   const token =await User.matchPasswordAndGenerateToken(email,password);
   return res.cookie("token",token).redirect("/");
   } catch (error) {
      return res.render("signin",{
         error:"Wrong Email OR Password"
      })
   }
})


 router.post("/signup",async(req,res)=>{
    const {fullname,email,password}  = req.body;
    await User.create({
      Fullname:fullname,
      Email:email,
      Password:password,
    })
    res.redirect("/user/signin")
 })

 router.get("/logout",(req,res)=>{
   res.clearCookie("token").redirect("/user/signin");
 })
module.exports = router;
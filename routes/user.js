
require('dotenv').config();
const { Router } = require("express");
const User = require("../models/user");


const crypto = require("crypto");
const nodemailer = require("nodemailer");

const upload = require('../middlewares/multer');

const router = Router();

router.get("/signin", (req, res) => {
   res.render("signin");
})
router.get("/signup", (req, res) => {
   res.render("signup");
})

router.get("/forgotpassword", (req, res) => {
   res.render("forgotpassword");
})


router.post("/signin", async (req, res) => {
   const { email, password } = req.body;
   try {

      const token = await User.matchPasswordAndGenerateToken(email, password);
      return res.cookie("token", token).redirect("/");
   } catch (error) {
      return res.render("signin", {
         error: "Wrong Email OR Password"
      })
   }
})


router.post("/signup", upload.single('profileImage'), async (req, res) => {
  const { fullname, email, password } = req.body;
  const profileImagePath = req.file ? "/uploads/" + req.file.filename : undefined;

  try {
    await User.create({
      Fullname: fullname,
      Email: email,
      Password: password,
      ProfileImage: profileImagePath || undefined, // schema default is used if none
    });

    res.render("signin", { message: "Signup successful! Please login." });
  } catch (error) {
    console.log(error);
    res.render("signup", { error: "Signup failed. Email may already be in use." });
  }
});



router.post("/forgotpassword", async (req, res) => {
   const { email } = req.body;

   if (!email) {
      return res.render("forgotpassword", {
         error: "Woops! Email is required",
      });
   }

   try {
      const user = await User.findOne({ Email: email });
      if (!user) {
         return res.render("forgotpassword", {
            error: "Invalid Email",
         });
      }

      // Generate token
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      user.otpExpire = Date.now() + 3600000; // 1 hour
      await user.save();

      // Email setup
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
         },
      });


      const mailOptions = {
         to: user.Email, 
         subject: "Blogify Password Reset Link",
         html: `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
  <h2 style="text-align: center; color: #4f46e5;">Password Reset Request</h2>

  <p style="font-size: 16px; color: #333;">Hi there,</p>

  <p style="font-size: 15px; color: #555;">
    You recently requested to reset your password. Click the button below to proceed:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${req.protocol}://${req.headers.host}/user/resetpassword/${token}"
       style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Reset Password
    </a>
  </div>

  <p style="font-size: 14px; color: #777;">
    If the button doesn't work, copy and paste this link into your browser:
  </p>

  <p style="word-break: break-all; font-size: 13px; color: #444;">
    ${req.protocol}://${req.headers.host}/user/resetpassword/${token}
  </p>

  <p style="font-size: 13px; color: #999;">
    This link is valid for 1 hour. If you didn’t request a password reset, you can safely ignore this email.
  </p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

  <p style="text-align: center; font-size: 13px; color: #aaa;">
    &copy; ${new Date().getFullYear()} Blogify. All rights reserved.
  </p>
</div>

  `,
      };


      await transporter.sendMail(mailOptions);

      return res.render("forgotpassword", {
         message: "Check your email for the reset link",
      });

   } catch (error) {
      console.log(error);
      return res.render("forgotpassword", {
         error: "Something went wrong",
      });
   }
});


router.get("/resetpassword/:token", async (req, res) => {
   const { token } = req.params;

   const user = await User.findOne({
      resetToken: token,
      otpExpire: { $gt: Date.now() }, // token still valid
   });

   if (!user) {
      return res.render("forgotpassword", {
         error: "Reset link expired or invalid.",
      });
      
   }

   return res.render("resetpassword", { token });
});


router.post("/resetpassword", async (req, res) => {
   const { token, password } = req.body;

   const user = await User.findOne({
      resetToken: token,
      otpExpire: { $gt: Date.now() },
   });

   if (!user) {
      
      return res.render("forgotpassword", {
         error: "Reset link expired or invalid.",
      });
   }

   user.Password = password; // this will be auto-hashed via pre('save')
   user.resetToken = undefined;
   user.otpExpire = undefined;
   await user.save();
   
   return res.redirect("/user/signin")
});



router.get("/logout", (req, res) => {
   res.clearCookie("token").redirect("/user/signin");
})
module.exports = router;
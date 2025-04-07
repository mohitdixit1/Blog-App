const {Router} = require("express");
const multer = require("multer")
const path = require("path")
const Blog = require("../models/blog")
const Comment = require("../models/comments");



const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve('./public/uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});
  
  const upload = multer({ storage: storage })

router.get("/addblog",(req,res)=>{
    return res.render("addblog",{
        user:req.user,
    })
 })


 router.get("/:id",async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("CreatedBy");
    const comments = await Comment.find({BlogBy:req.params.id}).populate("CreatedBy").sort({ createdAt: -1 });
    
    return res.render("blog",{
        user:req.user,
        blog:blog,
        comments:comments,
    })
 })
 
 router.post("/", upload.single("coverimage"), async (req, res) => {
    const { body, title } = req.body;
    
    if (!title || !body) {
        return res.render("addblog", {
            
            user:req.user,
            error: "Title and Body are required.",
        });
    }
    if (!req.file) {
        return res.render("addblog", {
            user:req.user,
            error: "Cover image is required.",
        });
    }

    try {
        await Blog.create({
            Title: title,
            Body: body,
            CreatedBy: `${req.user._id}`,
            CoverImageUrl: `/uploads/${req.file.filename}`,
        });
        return res.redirect("/");
    } catch (error) {
        console.error("Blog creation failed:", error);
        return res.render("addblog", {
            
            user:req.user,
            error: "An unexpected error occurred. Please try again.",
        });
    }
});


router.post("/comment/:blogid",async (req,res)=>{
    
    await Comment.create({
        Content:req.body.content,
        BlogBy:req.params.blogid,
        CreatedBy:req.user._id,
    }) 
    return res.redirect(`/blog/${req.params.blogid}`);
})
module.exports = router;

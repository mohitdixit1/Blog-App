const { Schema, model } = require('mongoose');

const blogSchema =new Schema({
    Title:{
        type:String,
        Required:true,
    },
    Body:{
        type:String,
        Required:true,
    },
    CoverImageUrl:{
        type:String,
    },
    CreatedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
},{timestamps:true});

const Blog = model('blog', blogSchema);
module.exports = Blog;

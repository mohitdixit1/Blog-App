const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    Content:{
        type:String,
        Required:true,
    },
    BlogBy:{
            type:Schema.Types.ObjectId,
            ref:"blog",
        },
    CreatedBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
},{timestamps:true});


const Comment = model('comments', commentSchema);
module.exports = Comment;

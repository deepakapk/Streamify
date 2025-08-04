import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId :{
        type : String,
        requied : true,
    },
    videoId : {
        type : String,
        required : true,
    },
    desc: {
        type: String,
        required : true,
    }

}, {timestamps : true})

export const Comment = mongoose.model("Comment", CommentSchema)
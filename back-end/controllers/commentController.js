import { Comment } from "../models/comment.js"
import { Video } from "../models/video.js";

export const addComment = async(req , res) => {
    const newComment = new Comment({...req.body, userId: req.user.id})
    try {
        const savedcomment = await newComment.save();
        res.status(200).json(savedcomment)
    } catch (error) {
        res.status(500).json({message : "Internal Error Occured ", error : error.message})
    }
}


export const deleteComment = async(req , res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)

        if(req.user.id === comment.userId || req.user.id === video.userId)
        {
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json({message : "The comment has been deleted."})
        }else {
            res.status(403).json({message : "You can not delete"})
        }

    } catch (error) {
        res.status(500).json({message : "Internal Error Occured ", error : error.message})
    }
}


export const getComments = async(req , res) => {
    try {
        const comments = await Comment.find({videoId: req.params.videoId})
        res.status(200).json({comments})
    } catch (error) {
        res.status(500).json({message : "Internal Error Occured ", error : error.message})
    }
}
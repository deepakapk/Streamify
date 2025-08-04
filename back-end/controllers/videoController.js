import { User } from "../models/user.js";
import {Video} from "../models/video.js";

export const addVideo = async(req, res) =>{
    const newVideo = new Video({userId:req.user.id, ...req.body})
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json({message : "video Added Successfull!", savedVideo})
    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }

}

export const updateVideo = async(req, res) =>{
   try {
        const video = await Video.findById(req.params.id)
        if(!video)
            return res.status(404).json({message : "No Video Found to Delete"})

        if(req.user.id === video.userId)
        {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
                $set : req.body
            }, {new : true})
            return res.status(200).json({messsage : "Video Updated Successfully", updateVideo})
        } else {
            return res.status(400).json({message : "Some Error occured"})
        }
    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const deleteVideo = async(req, res) =>{
   try {
        const video = await Video.findById(req.params.id)
         if(!video)
            return res.status(404).json({message : "No Video Found to Delete"})
        if(req.user.id === video.userId)
        {
            await Video.findByIdAndDelete(req.params.id)
            return res.status(200).json({message:"Video Deleted Successfully"})
        } else {
            return res.status(400).json({message : "Some Error occured"})
        }
    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const getVideo = async(req, res) =>{
   try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const getVideos = async(req, res) => {
    try {
        const videos = await Video.find({userId: req.user.id})
        res.status(200).json(videos)
    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const addView = async(req, res)=>{
    try {
        await Video.findByIdAndUpdate(req.params.id,{
            $inc : {views: 1}
        })
        res.status(200).json({message : "Views increased"})
    } catch (error) {
        return res.status(500).json({message : "Internal Error", error: error.message})

    }
}
export const trend = async(req, res)=>{
    try {
        const videos = await Video.find().sort({views:-1})
        res.status(200).json({videos})
    } catch (error) {
        return res.status(500).json({message : "Internal Error", error: error.message})
    }
}
export const random = async(req, res)=>{
    try {
        const videos = await Video.aggregate([{
            $sample : {size : 40}
        }])
        res.status(200).json({videos})
    } catch (error) {
        return res.status(500).json({message : "Internal Error", error: error.message})
    }
}
export const subscribed = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(channelId => {
                return Video.find({userId : channelId})
            })
        )

        res.status(200).json({videos: list.flat().sort((a,b)=>b.createdAt - a.createdAt)})

    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}
export const getByTags = async(req, res)=>{
    const tags = req.query.tags.split(",")
    try {
        const videos = await Video.find({tags:{$in:tags}}).limit(20)
        res.status(200).json({videos})
    } catch (error) {
        return res.status(500).json({message : "Internal Error", error: error.message})
    }
}
export const search = async(req, res)=>{
    const query = req.query.q
    try {
        const videos = await Video.find({title: {$regex : query, $options: "i"}}).limit(40)
        res.status(200).json({videos})
    } catch (error) {
        return res.status(500).json({message : "Internal Error", error: error.message})
    }
}
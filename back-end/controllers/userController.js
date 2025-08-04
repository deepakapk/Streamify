import { User } from "../models/user.js"
import { Video } from "../models/video.js"
import jwt from "jsonwebtoken"

export const updateUser = async(req , res) =>{
    if(req.params.id === req.user.id)
    {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body
            }, {new : true}) // so that it will send us updatedUser after updating

            res.status(200).json({message : "Updated Succesffuly!", updatedUser})

        } catch (error) {
            return res.status(400).json({message : "Some Error occured", error : error.message})   
        }
    }else{
        return res.status(403).json({message : "Invalid access!"})
    }
}

export const deleteUser = async(req , res) =>{
    if(req.params.id === req.user.id)
    {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json({message : "Deleted Succesffuly!"})
        } catch (error) {
              return res.status(400).json({message : "Some Error occured", error : error.message})   
        }
    }else {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const getUser = async(req , res) =>{
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json({message : "User find" , user})
    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}


export const fetchUser = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "No token found", success: false });
        }

        // Synchronous verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const newUser = await User.findById(decoded.id);
        
        if (!newUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({ user: newUser });
    } catch (error) {
        console.error("Fetch User Error:", error.message);
        return res.status(403).json({ message: "Invalid access!", error: error.message });
    }
};

export const subscribe = async(req , res) =>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $push: {subscribedUsers : req.params.id}
        })

        await User.findByIdAndUpdate(req.params.id, {
            $inc: {subscribers : 1}
        })
        res.status(200).json({message : "Subsribed"})

    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const unsubscribe = async(req , res) =>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull: {subscribedUsers : req.params.id}
        })

        await User.findByIdAndUpdate(req.params.id, {
            $inc: {subscribers : -1}
        })
        res.status(200).json({message : "UnSubsribed"})

    } catch (error) {
        return res.status(403).json({message : "Invalid access!", error: error.message})
    }
}

export const like = async(req , res) =>{
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet : {likes : id},
            $pull : {dislikes : id}
        })

        res.status(200).json({message : "Liked!"})
    } catch (error) {
        return res.status(403).json({message : "Some Error Occured", error: error.message})
    }
}

export const dislike = async(req , res) =>{
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet : {dislikes : id},
            $pull : {likes : id}
        })

        res.status(200).json({message : "DisLiked!"})
    } catch (error) {
        return res.status(403).json({message : "Some Error Occured", error: error.message})
    }
}



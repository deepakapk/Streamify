import mongoose from "mongoose";

export const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName : "video_sharing"
    }).then(()=>{
        console.log("Connected to DataBase!");
    }).catch(err=>{
        console.log(err.message);
    })
}
import mongoose from "mongoose";
const tweetschema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:String,
        required:true
    }
},{timestamps:true})
    export const Tweet=mongoose.model("Tweet",tweetschema)

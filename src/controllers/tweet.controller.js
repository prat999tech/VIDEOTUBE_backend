import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import  {asyncHandler}  from "../utils/asynchandler.js";


const addtweet=asyncHandler(async(req,res)=>{
    const {tweet}=req.body;
    const user=req.user?._id;
    try{
    if(!text){
        throw new apiError(400,"text is required")
    }
    if(!user){
        throw new apiError(400,"user is required")
    }
    const creatingtweet= await new Tweet({
        user:user,
        tweet:tweet.trim()
        

    })
    const createdtweet=await creatingtweet.save();
    return res.status(200).json(
        new apiResponse(200,createdtweet,"tweet added")
    )
}catch(error){
    console.error(error);
    throw new apiError(404,error,"internal error occured")
    
}
    
})
const deletetweet=asyncHandler(async(req,res)=>{
    const {tweetid}=req.params;
    const userid=req.user?._id;
    try{
   
    if(!userid){
        throw new apiError(400,"user is required")//The selected code if (!userId) { throw new apiError(401, "User not authenticated"); } is checking if the userId variable, which is obtained from req.user?._id, has a value. This check is important to ensure that an authenticated user is making the request before attempting to create a tweet.
    }
    const tweettodelete=await Tweet.findById(tweetid);
    if(!tweettodelete){
        throw new apiError(404,"tweet not found")
    }
    if(!(tweettodelete.user.equals(userid))){
        throw new apiError(401,"you dont have permission to delete this tweet")
    }
    await Tweet.findByIdAndDelete(tweetid);
    return res.status(200).json(
        new apiResponse(200,"tweet deleted")
    )

     }catch(error){
        console.error(error);
        throw new apiError(404,error,"internal error occured")
     }

})
const updatetweet=asyncHandler(async(req,res)=>{
    const {tweetid}=req.params;
    const {tweet}=req.body;
    const userid=req.user?._id;
    try{
        if(!userid){
            throw new apiError(400,"user is not authenticated")
        }
         
         if (!mongoose.Types.ObjectId.isValid(tweetid)) {
        throw new apiError(400, "Invalid tweet ID");
        }
        const tweettoupdate=await Tweet.findById(tweetid);
        if(!tweettoupdate){
            throw new apiError(404,"tweet not found")
        }
        if(!(tweettoupdate.user.equals(userid))){
            throw new apiError(401,"you dont have permission to update this tweet")
        }
        const updatedtweet=await Tweet.findByIdAndUpdate(tweetid,
            {
                $set:{
                    tweet:tweet
                }
            },
            {
                new:true
            }
        )
        return res.status(200).json(
            new apiResponse(200,updatedtweet,"tweet updated")
        )

    }catch(error){
        console.error(error);
        throw new apiError(404,error,"internal error")
    }
})
   const getusertweet=asyncHandler(async(req,res)=>{
    const {userid}=req.params;//req.params is used for mandatory parts of the URL path that identify a specific resource, like /users/:userId/tweets.
    try{
    if(!userid){
        throw new apiError(404,"user id required")
    }
    if(!(mongoose.Types.ObjectId.isValid(userid))){
        throw new apiError(400, "Invalid user ID");
    }
    const gettweet=await Tweet.find({
        user:userid
    }).sort({createdAt:-1})
    return res.status(200).json(
        new apiResponse(200,gettweet,"tweets fetched")
    ) // we can do it using aggregate pipeline by $match and $lookup

}catch(error){
    console.error(error);
    throw new apiError(404,error,"internal error")
}




   })
export default{
    addtweet,
    deletetweet,
    updatetweet,
    getusertweet
}



 
 
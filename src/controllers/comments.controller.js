import  {asyncHandler}  from "../utils/asynchandler.js";
import { Comment } from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js"
import mongoose from "mongoose";
import { request } from "express";
import { Video } from "../models/video.model.js";

const commentadd=asyncHandler(async(req,res)=>{
    const {comment}=req.body;
    const {videoId}=req.params;
    const {userid}=req.user?._id;
    try{
    if(!userid){
        throw new apiError(400,"user is required")
    }
    if(!comment){
        throw new apiError(400,"comment is required")
    }
    if(!(mongoose.Types.ObjectId.isValid(videoId))){
        throw new apiError(400,"invalid video id")
    }
    const commentdata=new Comment({
        comment:comment,
        video:videoId,
        user:userid

    })
    const result=await commentdata.save();//saving data in mongo
    return res.status(200).json(
        new apiResponse(200,result,"comment added")
    )
}catch(error){
    console.error(error);
    
}


})
const deletecomment=asyncHandler(async(req,res)=>{
    const {commmentid}=req.params;
    const userid = req.user?._id;
  
    if(!(mongoose.Types.ObjectId.isValid(commmentid))){
        throw new apiError(400,"comment id invalid")
    }
    const commenttodelete=Comment.findById(commmentid)//commenttodelete will hold _id, content, video, owner, createdAt, updatedAt
    if(!commenttodelete){
        throw new apiError(404,"comment not found")

    }
    if(!commenttodelete.owner.equals(userid)){
        throw new apiError(400,"wrong user loggedin")
    }
    
    await Comment.findByIdAndDelete(commmentid)//commenttodelete.deleteOne() this is alternative way
    return res.status(200).json(
        new apiResponse(200, null, "Comment deleted successfully")
    );
   
})
const updatecomment=asyncHandler(async(req,res)=>{
    const {commentid}=req.params;
    const {videoid}=req.params;
    const {comment}=req.body;
    const userid=req.user?._id;
     if(!userid){
        throw new apiError(400,"user id required")
    }
     if (!(mongoose.Types.ObjectId.isValid(userid))) {
         throw new apiError(400, "Invalid user id");
    }
     
    if(!(mongoose.Types.ObjectId.isValid(videoid))){
        throw new apiError(400,"video id invalid")
    }
    const getvideoid= await Video.findById(videoid)
    if(!getvideoid){
        throw new apiError(404,"video not found")
    }
   
    if(!(mongoose.Types.ObjectId.isValid(commentid))){
        throw new apiError(400,"comment id invalid")
    }
    if(!(mongoose.Types.ObjectId.isValid(videoid))){
        throw new apiError(400,"video id invalid")
    }
  
   
    const commenttoupdate=await Comment.findByIdAndUpdate(commentid,
        {
            $set:{
                comment:comment
            }
        },
        {new:true}
    )
    return res.status(200).json(
        new apiResponse(200, commenttoupdate, "Comment updated successfully")
    )

})
const getcommentsbyuseronvideos=asyncHandler(async(req,res)=>{
    const {videoid,ownerid}=req.query;
    const objectquery={};
    if(videoid){
        if(!(mongoose.Types.ObjectId.isValid(videoid))){
            throw new apiError(400,"video id invalid")
        }
        objectquery.videoid=videoid;
    
    }
    if(ownerid){
         if(!(mongoose.Types.ObjectId.isValid(ownerid))){
            throw new apiError(400,"owner id invalid")
        }
        objectquery.ownerid=ownerid;
    }
    if(Object.keys(objectquery).length==0){
        throw new apiError(400,"video id or owner id required")
    }
    
    console.log(objectquery);
    const comment=await Comment.find(objectquery);
    return res.status(200).json(new apiResponse(200,comment,"we have get comments by specific user on video"));

})
const getallcommentsonvideobuusers=asyncHandler(async(req,res)=>{
    const {videoid}=req.query;
    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(request.query.limit,10)||10;//The 10 specifies that the number should be parsed in base 10 (decimal),limit->kitne comments eek page m hone chahie
    if(!(mongoose.Types.ObjectId.isValid(videoid))){
        throw new apiError(400,"video id invalid")
    }
    const skip=(page-1)*limit;
    try{
        const commentaggregate=Comment.aggregate([
            {
            $match:{
                video:new mongoose.Types.ObjectId(videoid)
            }
        },
        {
            $lookup:{
                from:"User",
                localField:"owner",
                foreignField:"_id",
                as:"ownerdetails"
            }
        },
        {
            $unwind:"$ownerdetails"
        },
        {
            $project:{
                _id:1,
                comment:1,
                video:1,
                owner:{
                    _id:"$ownerdetails._id",
                    username:"$ownerdetails.username",
                    avatat:"$ownerdetails.avatar"
                }
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        }
        ]);
         // Execute the aggregation pipeline
        const comments = await commentaggregate.exec();

        // Get the total count of comments for the video to calculate total pages
        const totalComments = await Comment.countDocuments({ video: videoid });

        // Calculate total pages
        const totalPages = Math.ceil(totalComments / limit);
        return res.status(200).json(
            new apiResponse(200,
                {
                comments,
                totalComments,
                totalPages,
                currentpage: page
                },
                "comment fetched"

            
            )
        )

    }catch(error){
        console.error(error);
        throw new apiError(404,error,"internal server error")
        
    }


})
export {
    commentadd,
    deletecomment,
    updatecomment,
    getcommentsbyuseronvideos,
    getallcommentsonvideobuusers
}



/*
/////geminicode////
const getUserCommentsOnVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id; // Get user ID from authenticated user

    if (!userId) {
        throw new apiError(401, "User not authenticated");
    }

    if (!videoId) {
        throw new apiError(400, "Video ID is required");
    }

    if (!(mongoose.Types.ObjectId.isValid(videoId))) {
        throw new apiError(400, "Invalid video ID");
    }

    // Find comments where the 'video' field matches videoId and 'owner' field matches userId
    // Assuming 'owner' is the field storing the user reference in your Comment model
    const userComments = await Comment.find({
        video: videoId,
        owner: userId
    }).populate("owner", "username avatar"); // Optionally populate user details

    if (!userComments || userComments.length === 0) {
        // Return 404 if no comments are found, or 200 with an empty array
        return res.status(200).json( // Returning 200 with empty array is often preferred for lists
            new apiResponse(200, [], "No comments found for this user on this video")
        );
    }

    return res.status(200).json(
        new apiResponse(200, userComments, "User comments on video fetched successfully")
    );
});

Let's say a user makes a request to fetch comments for a video with the URL:
/videos/60c72b2f9b1e8b001c8e4f8a/comments?page=3&limit=5

req.query.page is "3".

parseInt("3", 10) is 3.

3 || 1 is 3. So, page becomes 3.

req.query.limit is "5".

parseInt("5", 10) is 5.

5 || 10 is 5. So, limit becomes 5.

In this case, the code correctly sets page to 3 and limit to 5, allowing you to fetch the comments for the third page with 5 comments per page.

The code you've selected is a Mongoose aggregation pipeline. Think of it like a multi-step process that MongoDB uses to process and transform documents (in this case, comments) to give you the exact data you need in the desired format.

Here's a simple breakdown of each step (stage) in the pipeline:

$match: { video: new mongoose.Types.ObjectId(videoId) }

What it does: This is the first filter. It looks at all the comments in your database and keeps only those that belong to the specific videoId you provided.
Example: Imagine you have comments for Video A, Video B, and Video C. If videoId is for Video B, this stage filters out all comments for Video A and Video C, leaving only comments for Video B.
$lookup: { from: "users", localField: "owner", foreignField: "_id", as: "ownerDetails" }

What it does: This stage connects the comments to the users who wrote them. It goes to the "users" collection, finds the user whose _id matches the owner field in the comment document, and adds the user's details as a new array field called ownerDetails to each matching comment document.
Example: A comment document might look like { _id: ..., comment: "Great video!", owner: "user123", ... }. This stage finds the user document with _id: "user123" and adds it: { _id: ..., comment: "Great video!", owner: "user123", ownerDetails: [{ _id: "user123", username: "Alice", avatar: "..." }], ... }.
$unwind: "$ownerDetails"

What it does: The $lookup stage adds ownerDetails as an array (even if there's only one match). $unwind deconstructs this array. If the ownerDetails array contains a single user document, $unwind replaces the array with that single document. If the array was empty (meaning no matching user was found, which shouldn't happen if owner is a required valid ObjectId), the original comment document would be removed from the pipeline.
Example: Continuing the previous example, the document { ..., ownerDetails: [{ _id: "user123", username: "Alice", avatar: "..." }] } becomes { ..., ownerDetails: { _id: "user123", username: "Alice", avatar: "..." } }.
$project: { ... }

What it does: This stage reshapes the output documents. You specify exactly which fields you want to keep from the documents that have gone through the previous stages, and you can rename fields or create new ones. In this case, it's selecting the comment's _id, comment content, video ID, creation and update timestamps, and then specifically selecting the _id, username, and avatar from the ownerDetails object and nesting them under an owner field.
Example: The document { _id: "comment456", comment: "Great video!", video: "videoB", createdAt: ..., updatedAt: ..., ownerDetails: { _id: "user123", username: "Alice", avatar: "...", email: "..." } } is transformed into { _id: "comment456", comment: "Great video!", video: "videoB", createdAt: ..., updatedAt: ..., owner: { _id: "user123", username: "Alice", avatar: "..." } }. Notice how the email from ownerDetails is excluded.
$sort: { createdAt: -1 }

What it does: This stage orders the documents. { createdAt: -1 } means it sorts by the createdAt field in descending order, so the newest comments appear first.
Example: If you have comments created at 10:00 AM, 10:05 AM, and 10:02 AM, after this stage they will be ordered 10:05 AM, 10:02 AM, 10:00 AM.
$skip: skip

What it does: This stage skips a specified number of documents from the beginning of the results. This is used for pagination. The skip variable is calculated based on the requested page and limit.
Example: If page is 2 and limit is 10, skip will be 10. This stage will skip the first 10 comments (which would be the first page).
$limit: limit

What it does: This stage limits the number of documents returned. This is also used for pagination. The limit variable is the requested number of comments per page.
Example: If limit is 10, this stage will only return the next 10 documents after skipping (or from the beginning if no documents were skipped).


*/
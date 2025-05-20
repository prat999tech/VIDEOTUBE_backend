import  {asyncHandler}  from "../utils/asynchandler.js";
import {apiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
const generateAccessAndRefreshTokens=async(userId)=>{
    try{
        
    const user=await User.findById(userId)
    const accessToken=await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()
    //yeh dono method cal krke maine access or refresh token bna lia
    user.refreshToken=refreshToken //user ke andr humne refresh token ko save krwa lia
    await user.save({validateBeforeSave:false}) //validateBeforeSave:false isliye kiya kyuki hume refresh token ko save krna ha jo validation krna hoga, yha humne isse kisi variable m save nhi kra kyuki hume need nhi thi bss yeh kaam ho jaana chahie tha yhi need thi
    return {accessToken,refreshToken}
    }
    catch(error){
        console.error(error)
        
        throw new apiError(500,"Something went wrong while generating access token");
        
        

    }
}
//access token hum client ko dedete h pr refersh token ko hume database m save krna hota ha 



 ///GEMINI CODE////

const registerUser = asyncHandler(async (req, res) => {
    console.log("Inside registerUser controller"); // Log entry point

    const { fullName, email, username, password } = req.body;
    console.log("Received body data:", { fullName, email, username, password }); // Log received data

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        console.log("Validation failed: Fields are empty."); // Log validation failure
        throw new apiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    console.log("Checked for existing user. Result:", existedUser); // Log result of existing user check

    if (existedUser) {
        console.log("User already exists:", existedUser); // Log if user exists
        throw new apiError(409, "User with email or username already exists");
    }

    console.log("req.files object:", req.files); // Log the entire req.files object from Multer

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    console.log("Extracted local file paths:", { avatarLocalPath, coverImageLocalPath }); // Log extracted paths

    if (!avatarLocalPath) {
        console.log("Validation failed: Avatar file is required."); // Log missing avatar
        throw new apiError(400, "Avatar file is required");
    }

    console.log("Attempting to upload avatar to Cloudinary..."); // Log before avatar upload
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar Cloudinary upload result:", avatar); // Log avatar upload result

    console.log("Attempting to upload cover image to Cloudinary..."); // Log before cover image upload
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Cover image Cloudinary upload result:", coverImage); // Log cover image upload result


    // Note: You have a redundant check for !avatar here after the upload.
    // If uploadOnCloudinary returns null on failure, this check is fine,
    // but the error message might be misleading if the upload failed for a different reason.
    // Consider if you need this check or if the one before upload is sufficient.
    if (!avatar) {
         console.log("Cloudinary avatar upload returned null."); // Log if avatar upload returned null
         // The uploadOnCloudinary function already handles unlinking the local file on error.
         throw new apiError(500, "Failed to upload avatar to Cloudinary"); // More specific error
    }


    console.log("Attempting to create user in database..."); // Log before user creation
    const user = await User.create({
        fullName,
        avatar: avatar.url, // Use the URL from Cloudinary response
        coverImage: coverImage?.url || "", // Use the URL from Cloudinary response, default to empty string
        email,
        password,
        username: username.toLowerCase()
    });
    console.log("User.create result:", user); // Log the result of User.create

    if (!user) {
        console.log("User creation failed: User.create returned null or undefined."); // Log if create failed
        // Multer saved the file locally, and Cloudinary upload might have succeeded or failed.
        // If Cloudinary succeeded, you might have orphaned files.
        // If Cloudinary failed, uploadOnCloudinary already unlinked.
        // Consider adding cleanup for successful Cloudinary uploads if User.create fails.
        throw new apiError(500, "Something went wrong while registering the user in DB"); // More specific error
    }

    console.log("Attempting to find created user for response..."); // Log before finding created user
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    console.log("Created user found for response:", createdUser); // Log the found user

    if (!createdUser) {
         console.log("Failed to find created user after creation."); // Log if finding failed
         // This is less likely if User.create succeeded, but possible.
         throw new apiError(500, "Something went wrong while fetching created user");
    }


    console.log("User registered successfully. Sending response."); // Log before sending success response
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    );
});

//Gemini code end/////////



/////LOGIN USER CODE (ACCESS TOKEN AND REFERSH TOKEN)///////
const loginUser=asyncHandler(async(req,res)=>{
    //req body -> data
    //validate if username or email is there or not
    //find the user
    //if user is there then check password is correct or not
    //access and refresh token
    //send tokens to cookies
    const{email,username,password}=req.body; //req.body se data le lia 
     if(!username && !email){ //() or (!(email || username)) -> we can use this also
        throw new apiError(400,"username or email is required")

     }
     const user=await User.findOne({
        $or:[{username},{email}] 
     }) // here we find using OR operator if we have username or email
      if(!user){
        throw new apiError(404,"user does not exist")
      }
      /*We store the result in the user variable so that we can access and use the data of the found user document in the subsequent lines of code. Without storing it, we wouldn't be able to check if a user was found (if (!user)) or access their properties (like user._id, user.password, etc.) later in the function.
        User.findOne() finds a document matching the criteria (username OR email), the user variable will store a Mongoose document object. This object is an instance of your User model and represents the data of the user found in the database.
        This Mongoose document object will contain all the fields defined in your userSchema for that specific user
      */
     /////if we have finded user then we check password is correct or not////
      const isPasswordValid=await user.isPasswordCorrect(password) // yha humne 'user' se check kia ha kyuki jo jo method humne bnaya ha jaise 'isPasswordCorrect'('isPasswordCorrect' yh wala method humne 'user.model' m bnaya ha, toh ab yeh function call hoga or humara control 'user.model' wli file pr chla jayega) yeh sbb hum 'user' ke through access kr skte ha kyuki user m mongodb humne object return krta ha jismai humara data hota ha or 'User' wle se hum sirf jo mongodb ke methods ha usko use kr skte ha jaise username ya email find krna mongodb ya database m ha ya nhi
      //'await user.isPasswordCorrect(password)' iske andr jo user ne password likha ha woh aayega or 'this.password' m jo password humne save kia ha woh aayega
      if(!isPasswordValid){
        throw new apiError(404,"password is incorrect")
      }
      const{accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)//yha function call hua ha or  hume function return krega accesstoken or refresh token usko humne save kr lia ha 
       
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken");//This line is like saying, "Now that the refresh token has been saved to the album, go back to the album again and get me the user's photo." This time, the photo you get (loggedInUser) is the updated one that includes the refresh token.( explained in "onenote")
       //////COOKIES/////
     /*
     you don't need to import cookie-parser directly into your user.controller.js file to use the .cookie() method on the res object.
     this is because cookie-parser is an Express middleware. Middleware functions are typically applied at a higher level in your application's setup (usually in your main app.js or index.js file).
     When you use app.use(cookieParser()) (or similar syntax) in your main application file, cookie-parser intercepts all incoming requests. It then modifies the req and res objects for that request before passing them down the middleware chain to your routes and controllers.
     */
       const options={
        httpOnly:true,
        secure:true,
       }// these line means only server can modify the cookies and client can not modify the cookies
       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
        new apiResponse(
            200,
            {
                user:loggedInUser, accessToken,refreshToken  // this is my 'this.data' field in apiResponse class
            }, 
            "user logged in successfully"
        )
       )

}    
)
///LOGOUTB USER////we will remove cookies and refresh tokens for logging out a user////
//now we will make our own middleware 
const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },
    { new: true } // Return the updated document
)

    const options={
        httpOnly:true,
        secure:true,
       }
       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new apiResponse(200,{message:"user logged out successfully"},"user logged out successfully"))
    
})
  // now we will make an end point where user can refresh its token when access token gets expired//
     const refreshAcessToken=asyncHandler(async (req,res)=>{
        const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken//here we are accessing refresh token as it is in our cookies or for mobile app it is in our header body
        if(!incomingRefreshToken){
            throw new apiError(401,"refresh token is required")
        }
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"unauthorized reinvalid refresh token")
      
        }
        //'user.refreshToken=refreshToken ' iska use krke humne refresh token ko save krwaya tha user m or jo abhi humne decode kra ha 'incoming refresh token' isse jo user dhundha ha hummne woh same hona chhaie issliye checking kenge 

        if(incomingRefreshToken!=user.refreshToken){
            throw new apiError(401,"refresh token expired or user expired")
        }
        const options={
            httpOnly:true,
            secure:true
        }
       const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new apiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
     })
     const changeCurrentPassword=asyncHandler(async (req,res)=>{

        const {oldPassword,newPassword,confirmPassword}=req.body
        if(!(newPassword===confirmPassword))  {       
            throw new apiError(400,"password and confirm password should be same")
        }
        const user=await User.findById(req.user._id)//abb mera user phle se authorized ha loggedin ha jo middleware humne bnaya ha auth ka usse pta chla or usmai 'req.user' m authorized user humme daal dia
        const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
        if(!isPasswordCorrect){
            throw new apiError(400,"old password is incorrect")
        }
        user.password=newPassword //user ha uske andr field ha password usmai humne new password update krdia
       await user.save({validateBeforeSave:false})//yha humne validation ko false krdia kyuki hume sirf password update krna ha
         return res.status(200).json(
            new apiResponse(200,user,"password updated successfully")
         )
     })
     const getCurrentUser=asyncHandler(async (req,res)=>{
        return res.status(200)
        .json(
            new apiResponse(200,req.user,"user fetched successfully")
        )//kyuki mera user phle se checked ha or woh chekced user ko humne req.user m save kra hua ha toh humne seedha whi access krwa lia

     })
     const updateAccountDetails=asyncHandler(async (req,res)=>{
        const{fullName,email}=req.body
        if(!(fullName||!email)){
            throw new apiError(400,"fullname and email is required")
        }
        const user=User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    fullName,
                    email:email
                }
            },
            {new:true}//update hone ke bad jo infomeration ha woh return hoti ha
        ).select("-password")
        return res.status(200).json(
            new apiResponse(200,user,"account details updated successfully")
        )

    })

     const updateUserAvatar=asyncHandler(async(req,res)=>
    {
        const avatarLocalPath=req.file?.path
        if(!avatarLocalPath){
            throw new apiError(400,"avatar is required")
        }
        const avatar=await uploadOnCloudinary(avatarLocalPath)
        if(!avatar.url){
            throw new apiError(400,"avatar upload failed")
        }
        const user=User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    avatar:avatar.url
                }
            },
            {new:true}
        )
        return res.status(200).json(
            new apiResponse(200,user,"avatar updated successfully")
            )
        })
       
        const updateCoverImage=asyncHandler(async(req,res)=>
            {
                const coverImageLocalPath=req.file?.path
                if(!coverImageLocalPath){
                    throw new apiError(400,"coverimage is required")
                }
                const coverImage=await uploadOnCloudinary(coverImageLocalPath)
                if(!coverImage.url){
                    throw new apiError(400,"cover upload failed")
                }
                const user=await User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $set:{
                            coverImage:coverImage.url
                        }
                    },
                    {new:true}
                ).select("-password")
                return res.status(200).json(
                    new apiResponse(200,user,"cover image updated successfully")
                    )
                  
                })
                const getUserChannelProfile = asyncHandler(async(req, res) => {
                    const {username} = req.params
                
                    if (!username?.trim()) {
                        throw new apiError(400, "username is missing")
                    }
                
                    const channel = await User.aggregate([
                        {
                            $match: {
                                username: username?.toLowerCase()
                            }
                        },
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "channel",
                                as: "subscribers"
                            }
                        },
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "subscriber",
                                as: "subscribedTo"
                            }
                        },
                        {
                            $addFields: {
                                subscribersCount: {
                                    $size: "$subscribers"
                                },
                                channelsSubscribedToCount: {
                                    $size: "$subscribedTo"
                                },
                                isSubscribed: {
                                    $cond: {
                                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                fullName: 1,
                                username: 1,
                                subscribersCount: 1,
                                channelsSubscribedToCount: 1,
                                isSubscribed: 1,
                                avatar: 1,
                                coverImage: 1,
                                email: 1
                
                            }
                        }
                    ])
                
                    if (!channel?.length) {
                        throw new apiError(404, "channel does not exists")
                    }
                
                    return res
                    .status(200)
                    .json(
                        new apiResponse(200, channel[0], "User channel fetched successfully")
                    )
                })
                const getWatchHistory = asyncHandler(async(req, res) => {
                    const user = await User.aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(req.user._id)
                            }
                        },
                        {
                            $lookup: {
                                from: "videos",
                                localField: "watchHistory",
                                foreignField: "_id",
                                as: "watchHistory",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "owner",
                                            foreignField: "_id",
                                            as: "owner",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        fullName: 1,
                                                        username: 1,
                                                        avatar: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $addFields:{
                                            owner:{
                                                $first: "$owner"
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ])
                
                    return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            user[0].watchHistory,
                            "Watch history fetched successfully"
                        )
                    )
                })
                
                    export {registerUser,
                        loginUser,
                        logoutUser,
                        refreshAcessToken,
                        changeCurrentPassword,
                        getCurrentUser,
                        updateAccountDetails,
                        updateUserAvatar,
                        updateCoverImage,
                        getUserChannelProfile,
                        getWatchHistory}


// jo bhi router or controller se export ho rha ha usko hum zyadar app.js m import krte ha
//I understand you're asking about how req.user?._id reliably identifies the authenticated user in the updateAccountDetails controller, given that the verifyJWT middleware sets req.user = user. You want to know how the system ensures that this req.user is indeed the authenticated one and not some other user data that might be on the req object.
//The crucial point is that all middleware functions and the final route handler in a single request chain receive the same req object. When verifyJWT modifies the req object by adding req.user = user;, that exact same req object, now with the user property attached, is passed to the next function in the chain, which is your updateAccountDetails controller.

//endpoint=url












































/*

const registerUser=asyncHandler(async (req,res)=>{
    //steps to register user:-
    // get user detail from frontend
    //1.validation-not empty
    //2.check if user already exist:htrough username and email
    //3.check for images and avatar
    //4.upload then to cloudinary,
    //situation rightnow- user ne mujhe data dia fir maine image li uss image ko cloudinary pr upload krdia fir cloudinary se image wapas aagyi ha url ke form mai abb hum eek user object bnayenge
    //5. create user object in mongodb- create enntry in db
    //6. remove password and refresh token from response kyuki mai nhi chahta ki user ko referesh token or password as a response user ko bheju
    //7. check for user creation
    //8. send response to user
/////////////////////GETTING USER DETAIL/////////////////////////////////////
    const {fullName,email,username,password}=req.body //req. se hume data milta ha or agr data form se aa rha ha ya json se aa rha ho toh req.body se data mil jyega or humne destructure kr lia ha ki hume kya kya data chahie jaise fullname,username,email,password etc
    /*
    console.log(email) // yeh maine eek checking chlai ha ki data aa rha ha ya nhi 
    steps:-
     we will go to postman
     now we select the post request
     then we will select the body
     then we will select raw
     then we will select json
     then we will add the data in the form of json
    */
   /*
   //////////////////////Validation//////////////
   if(fullName===""){
    throw new ApiError("Please enter your full name",400)
   }
   if(email===""){
    throw new ApiError("Please enter your email",400)
   }
   if(username===""){
    throw new ApiError("Please enter your username",400)
   }
   if(password===""){
    throw new ApiError("Please enter your password",400)
   }
   ///USER EXTISTENCE/////
   const existedUser=await User.findOne({
    $or:[{username},{email}]//here we apply OR operator check in a array we check if object like username and email exist
   })
   if(existedUser){
       throw new ApiError("User already exist",409)
   }
   //File Handaling//
   //multer gives access to control files aslo
   //You do not need to import multer in your controller file (user.controller.js) because the controller functions are executed after multer has processed the request and made the file information available on the req object.
     const avatarLocalPath= req.files?.avatar[0]?.path // we will get first property of avatar
    const coverImageLocalPath=req.files?.coverImage[0]?.path
     if(!avatarLocalPath){ //if avatar is not in local path
        throw new ApiError("Please upload your avatar",400)
     }
     ////uploading photos to cloudinary and for this we import our cloudinary file/////
        const avatar=await uploadOnCloudinary(avatarLocalPath)
        const coverImage=await uploadOnCloudinary(coverImageLocalPath)
        if(!avatar){
            throw new ApiError("Please upload your avatar",400)
        }

        ////creating an object and entry in database////
        //user model ka use krke hi hum database bnayenge
       const user= await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url || "", //agar cover image ha toh url lelo wrna database m empty string store krdo
            username:username.toLowerCase(),
        })//database banane m time lgta ha issliye await ka  use kiye
          const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
          ) // jb bhi nya username bnega database m toh mongodb eek id field bhi add krdega or uss id ka use krke hum check krlenge ki user bna ha ya nahi or '.select' ka use krke uske andr woh field daalenge jo hume nhi chahie jaise 'password' or 'refreshToken' 
            

          if(!createdUser){
            throw new ApiError("Something went wrong while creating user",500)
          }
        ////jbbb humara user ban jayega tb hum 'ApiResponse' file ko import krke response lenge ki 'user has been created'/////////////
          return res.status(201).json(
            new ApiResponse(200,createdUser,"User created successfully")


          )




})

    /*return res.status(200).json({
        message:"User registered successfully"
    })//yaha pr humne "asynchandler" eek higherorder function bnaya ha jo accept kr rha h "async" function fir uss function m humne response status 200 dia ha or woh humne json format m dia ha or 200 response status mtlb hota ha "OK"
})
    */
//controller method run jb hoga jb koi url hit hoga or woh sbb kaam hum routes m krte ha
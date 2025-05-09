import  {asyncHandler}  from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js"



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

 ///GEMINI CODE////

const registerUser = asyncHandler(async (req, res) => {
    console.log("Inside registerUser controller"); // Log entry point

    const { fullName, email, username, password } = req.body;
    console.log("Received body data:", { fullName, email, username, password }); // Log received data

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        console.log("Validation failed: Fields are empty."); // Log validation failure
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    console.log("Checked for existing user. Result:", existedUser); // Log result of existing user check

    if (existedUser) {
        console.log("User already exists:", existedUser); // Log if user exists
        throw new ApiError(409, "User with email or username already exists");
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
        throw new ApiError(400, "Avatar file is required");
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
         throw new ApiError(500, "Failed to upload avatar to Cloudinary"); // More specific error
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
        throw new ApiError(500, "Something went wrong while registering the user in DB"); // More specific error
    }

    console.log("Attempting to find created user for response..."); // Log before finding created user
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    console.log("Created user found for response:", createdUser); // Log the found user

    if (!createdUser) {
         console.log("Failed to find created user after creation."); // Log if finding failed
         // This is less likely if User.create succeeded, but possible.
         throw new ApiError(500, "Something went wrong while fetching created user");
    }


    console.log("User registered successfully. Sending response."); // Log before sending success response
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    );
});

// ... (other controller functions)











































export {registerUser}
// jo bhi router or controller se export ho rha ha usko hum zyadar app.js m import krte ha



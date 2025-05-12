//yeh middleware sirf verufy krega ki user ha ya nhi

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//we will use tokens to verify as when we logged in user we have gave them access token and refresh token
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")//token mera cookies ke and rha toh wha se maine token lia ya token as a header ke form m bhi aa skta ha toh woh bhi access lellia
        
        // console.log(token);
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)//This line takes the user's access token and your secret key, checks if the token is valid and trustworthy. If it is, it gives you back the user's information that was encoded inside that token.
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()//'router.route("/logout").post(verifyJWT,logoutUser)' -> next() se humara controller abb 'logoutUser' wle method pr chla jayeg
 
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
    
})

//we use auth middleware for logout:-
//to identify user:When a user wants to log out, your server needs to know who is requesting to log out. The verifyJWT middleware does exactly this. It takes the access token provided by the user, verifies it, and then finds the corresponding user in the database. By the time the request reaches your logoutUser controller function, verifyJWT has already attached the authenticated user's information to req.user. Your logoutUser function then uses req.user._id to find the user in the database and clear their refresh token. Without verifyJWT, the server wouldn't know which user is trying to log out.
//abb jaise hume like ya comment krna ha toh hume check krna hota ha ki user authenticated ha ya nhi iske liye hume auth middleware ki help lgegi
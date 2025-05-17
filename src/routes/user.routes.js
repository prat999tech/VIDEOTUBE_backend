import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import {loginUser} from "../controllers/user.controller.js"
import {logoutUser} from "../controllers/user.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js" 
import { refreshAcessToken } from "../controllers/user.controller.js";   
const router= Router()
// register route pr koi bhi request kr rha ha toh "registerUser" method execute ho jata ha abb mai yeh method ko execute krne se phle eek middleware daalunga jo mera file checking krega ki image or avatar ki files upload hui ha ya nhi
/*upload.fields([
  {
    name: "avatar", //frontend pr bhi same name se hona chahie
    maxCount: 1 // mai sirf eek file lunga
  },
  {
    name:"coverImage",
    maxCount:1
  }
])
//After successfully processing the files, it adds the file information to the request object (req). When using upload.fields(), the file information is added to req.files.
router.route("/register").post(registerUser)//jb humne url pr user likha toh control humara yha aaya fir jb humne url pr register likha fir hum log chlen jayenge"user.controller.js file pr wha pr async method run hoga or hume response mil jayega {"user registered successfully"} 
*/

////Gemini code///////////
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )
    ////end of gemini code/////
    console.log("now we are logging in user");
    
    router.route("/login").post(loginUser)
    console.log("now we are logging out user");
    
    router.route("/logout").post(verifyJWT,logoutUser)//yha se sbse phle hum 'auth middleware' pr jyenge jaha humara 'verifyJWT' function bna ha
    router.route("/refresh-token").post(refreshAcessToken)//here we make api endpoint route and we donot need verifyjwt here as we have done that work already in our refreshAccessToken method
   // router.route("/refresh-token").post(refreshAccessToken)
   router.route("/change-password").post(verifyJWT, changeCurrentPassword)
   router.route("/current-user").get(verifyJWT, getCurrentUser)
   router.route("/update-account").patch(verifyJWT, updateAccountDetails)

    router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
    router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

    router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
     router.route("/history").get(verifyJWT, getWatchHistory)
       export default router
import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

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
export default router
import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"

const router= Router()
router.route("/register").post(registerUser)//jb hume url pr user likha toh control humara yha fir jb humne url pr register likha fir hum log chlen jayenge"user.controller.js file pr wha pr async method run hoga or hume response mil jayega {"user registered successfully"} 

export default router
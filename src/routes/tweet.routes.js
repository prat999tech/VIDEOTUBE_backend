import { verifyJWT } from "../middlewares/auth.middleware.js";
import {Router} from "express";
import {
     addtweet,
    deletetweet,
    updatetweet,
    getusertweet
} from "../controllers/tweet.controller.js";
const router=Router();
router.use(verifyJWT);
router.route("/").post(addtweet);
router.route("/:tweetid").delete(deletetweet);
router.route("/:tweetid").patch(updatetweet);
router.route("/:userid").get(getusertweet);
export default router;
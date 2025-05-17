import { Router } from "express";
import {commentadd} from "../controllers/comments.controller.js"
import {deletecomment} from "../controllers/comments.controller.js"
import {updatecomment} from "../controllers/comments.controller.js"
import {getallcommentsonvideobuusers} from "../controllers/comments.controller.js"
import {getcommentsbyuseronvideos} from "../controllers/comments.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.use(verifyJWT);
router.route("/:videoId").post(commentadd);
router.route("/:commentid").delete(deletecomment); 
router.route("/:commentid").patch(updatecomment);
router.route("/user-on-video").get( getcommentsbyuseronvideos); 
router.route("/video/:videoid").get(getallcommentsonvideobuusers); // Does NOT require authentication

export default router;

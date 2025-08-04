import express from "express"
import { addVideo, addView, deleteVideo, getByTags, getVideo, getVideos, random, search, subscribed, trend, updateVideo } from "../controllers/videoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router()

router.post("/", verifyToken, addVideo )
router.put("/:id", verifyToken, updateVideo )
router.delete("/:id", verifyToken, deleteVideo )
router.get("/find/:id", getVideo )
router.get("/findall", verifyToken, getVideos)
router.put("/view/:id", addView )
router.get("/trend", trend )
router.get("/random", random )
router.get("/sub", verifyToken, subscribed )
router.get("/tags", getByTags )
router.get("/search",  search)


export default router;


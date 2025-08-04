import express from "express"
import { deleteUser, dislike, fetchUser, getUser, like, subscribe, unsubscribe, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router()


router.put("/:id", verifyToken, updateUser)
router.delete("/:id",verifyToken, deleteUser)
router.get("/find/:id", getUser)
router.get("/fetchUser", fetchUser)
router.put("/sub/:id",verifyToken, subscribe)
router.put("/unsub/:id",verifyToken, unsubscribe)
router.put("/like/:videoId",verifyToken, like)
router.put("/dislike/:videoId",verifyToken, dislike)



export default router;
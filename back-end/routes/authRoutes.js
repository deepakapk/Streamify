import express from "express"
import { googleAuth, logout, signin, signup } from "../controllers/authController.js"
import { verifyToken } from "../middlewares/verifyToken.js"
const router= express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", googleAuth)
router.get("/logout", logout)

export default router;
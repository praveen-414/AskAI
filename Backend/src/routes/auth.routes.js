import { Router } from "express";
import authController from "../controllers/auth.controller.js";


const authRouter = Router();

authRouter.post("/signup",authController.signup)
authRouter.post("/login",authController.login)
authRouter.get("/logout",authController.logout)
authRouter.get("/logout-all",authController.logoutAll)
authRouter.get("/refresh-token",authController.getRefreshToken)
 

export default authRouter;
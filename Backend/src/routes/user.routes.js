import { Router } from "express";
import userController from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = Router();

userRouter.get("/current-user", isAuth, userController.currentUser);

export default userRouter;

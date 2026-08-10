import { Router } from "express";
import messageController from "../controllers/ai.controller.js";
import isAuth from "../middlewares/isAuth.js";


const messageRouter = Router();

messageRouter.post("/send-msg", isAuth, messageController.sendMessage);

export default messageRouter;

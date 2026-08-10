import express from "express";
import chatController from "../controllers/chat.controller.js";
import isAuth from "../middlewares/isAuth.js";

const chatRouter = express.Router();

chatRouter.post("/create", isAuth, chatController.createChat);
chatRouter.delete("/:chatId", isAuth, chatController.deleteChat);
chatRouter.get("/", isAuth, chatController.getChats);

export default chatRouter;
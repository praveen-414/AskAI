import chatModel from "../models/chat.model.js";

const createChat = async (req, res) => {
  try {
    const chat = await chatModel.create({
      user: req.userId,
    });

    res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await chatModel
      .find({ user: userId })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {createChat, deleteChat,getChats} ;
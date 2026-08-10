import chatModel from "../models/chat.model.js";
import llm from "../config/ai.js";

const sendMessage = async (req, res) => {
  try {
    const { input, chatId } = req.body;
    const userId = req.userId;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Type something...",
      });
    }

    const chat = await chatModel.findOne({
      _id: chatId,
      user: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const aiMsg = await llm.invoke([
      {
        role: "user",
        content: input,
      },
    ]);

    const aiResponse = aiMsg.content;

    let title = chat.title;

    if (chat.messages.length === 0) {
      const titleMsg = await llm.invoke([
        {
          role: "system",
          content:
            "Generate a very short chat title. Return ONLY 2 to 4 words. No quotes, no punctuation, no explanation.",
        },
        {
          role: "user",
          content: input,
        },
      ]);

      title = titleMsg.content.trim();

      chat.title = title;
    }

    chat.messages.push(
      {
        role: "user",
        content: input,
      },
      {
        role: "assistant",
        content: aiResponse,
      },
    );

    await chat.save();

    res.status(200).json({
      success: true,
      aiResponse,
      title: chat.title,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default { sendMessage };

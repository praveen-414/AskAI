import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import styles from "../Messagearea/Messagearea.module.css";
import SenderMessage from "../SenderMessage/SenderMessage";
import AiMessage from "../AiMessage/AiMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  newChat,
  setMessages,
  updateChatTitle,
} from "../../Redux/Slices/messageSlice";
import logo from "../../assets/logoLightmode.png";
import api from "../../config/axios";
import { MoonLoader } from "react-spinners";
import darklogo from "../../assets/darklogo.png"

const Messagearea = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { chats, selectedChatId } = useSelector((state) => state.messages);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedChat?.messages, loading]);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;

    try {
      let chatId = selectedChatId;

      // Create a new chat in DB
      if (!chatId) {
        const chatRes = await api.post("/api/chat/create");

        chatId = chatRes.data.chat._id;

        // Store MongoDB chat ID in Redux
        dispatch(
          newChat({
            id: chatId,
          }),
        );
      }

      // Show user message immediately
      const userMessage = {
        role: "user",
        content: userInput,
      };

      dispatch(setMessages(userMessage));

      setInput("");
      setLoading(true);

      // Send message to AI
      const res = await api.post("/api/ai/send-msg", {
        input: userInput,
        chatId: chatId,
      });

      console.log(res.data);

      // Show AI response
      const aiMessage = {
        role: "assistant",
        content: res.data.aiResponse,
      };

      dispatch(setMessages(aiMessage));
      dispatch(
        updateChatTitle({
          chatId,
          title: res.data.title,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.messageContainer}>
      {/* heading */}
      {selectedChat ? (
        <>
          <div className={styles.heading}>
            <h1>{selectedChat.title}</h1>
          </div>

          {/* messages  */}
          <div className={styles.messages}>
            {selectedChat?.messages?.map((message, index) => {
              return (
                <React.Fragment key={index}>
                  {message.role === "user" ? (
                    <SenderMessage message={message} />
                  ) : (
                    <AiMessage message={message} />
                  )}
                </React.Fragment>
              );
            })}
            {loading && (
              <div className={styles.aiLoading}>
                <MoonLoader size={15} color={theme === "dark" ? "#A78BFA" : "#7C3AED"}/>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* input  */}
          <div className={styles.inputContainer}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              type="text"
              placeholder="Message AskAI..."
            />
            <span onClick={sendMessage} className={styles.sendIcon}>
              <IoMdSend size={20} />
            </span>
          </div>
        </>
      ) : (
        <div className={styles.emptyContainer}>
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeIcon}>
              <img src={theme === "light" ? logo : darklogo} alt="AskAI" />
            </div>

            <h1>How can I help you today?</h1>

            <p>Ask anything, write code, or explore ideas.</p>
          </div>

          <div className={styles.suggestions}>
            <li onClick={() => setInput("Explain React hooks")}>
              <span>⌘</span>
              Explain React hooks
            </li>

            <li onClick={() => setInput("Help me debug my code")}>
              <span>✦</span>
              Help me debug my code
            </li>

            <li onClick={() => setInput("Help me build a portfolio website")}>
              <span>▣</span>
              Build a portfolio website
            </li>

            <li onClick={() => setInput("Teach me JavaScript")}>
              <span>◇</span>
              Learn JavaScript
            </li>

            <li onClick={() => setInput("Give me ideas for a project")}>
              <span>✧</span>
              Get ideas for a project
            </li>
          </div>

          <div className={styles.homeInputContainer}>
            <div className={styles.inputContainer}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                type="text"
                placeholder="Message AskAI..."
              />

              <span onClick={sendMessage} className={styles.sendIcon}>
                <IoMdSend size={21} />
              </span>
            </div>

            <p className={styles.disclaimer}>
              AskAI can make mistakes. Check important information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messagearea;

import React, { useRef } from "react";
import styles from "./AiMessage.module.css";
import aiBubble from "../../assets/aiBubble.png";
import { FiCopy, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

const AiMessage = ({ message }) => {
  const messageRef = useRef(null);
  const copyMessage = async () => {
    try {
      const text = messageRef.current.innerText;

      await navigator.clipboard.writeText(text);

      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };
  return (
    <div className={styles.aiMessage}>
      <div className={styles.header}>
        <img src={aiBubble} alt="AskAI" className={styles.avatar} />
      </div>

      <div className={styles.content}>
        <div ref={messageRef} className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className={styles.actions}>
        <FiCopy onClick={copyMessage} />
      </div>
    </div>
  );
};

export default AiMessage;

import React from 'react'
import styles from "../SenderMessage/SenderMessage.module.css"

const SenderMessage = ({message}) => {
  return (
    <div className={styles.sender}>
        <p>{message.content}</p>
    </div>
  )
}

export default SenderMessage
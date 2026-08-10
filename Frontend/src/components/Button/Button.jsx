import React from 'react'
import styles from "../Button/Button.module.css"

const Button = ({text,type,disabled,onClick, className = "",}) => {
  return (
    <button onClick={onClick} type={type} disabled={disabled}
       className={`${styles.btn} ${className}`}
    >{text}</button>
  )
}

export default Button
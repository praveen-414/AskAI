import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Messagearea from '../../components/Messagearea/Messagearea'
import styles from "../Home/Home.module.css"
import { useDispatch } from "react-redux";
import { setChats } from "../../Redux/Slices/messageSlice";
import api from "../../config/axios";
import { useEffect } from 'react';

const Home = () => {
  const dispatch = useDispatch();

useEffect(() => {
  const getChats = async () => {
    try {
      const res = await api.get("/api/chat");

      const chats = res.data.chats.map((chat) => ({
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
      }));

      dispatch(setChats(chats));
    } catch (error) {
      console.log(error);
    }
  };

  getChats();
}, [dispatch]);
  return (
    <div className={styles.homeContainer}>
      <Sidebar/>
      <Messagearea/>
    </div>
  )
}

export default Home
import React, { useState } from "react";
import styles from "../Sidebar/Sidebar.module.css";
import logo from "../../assets/logoLightmode.png";
import Button from "../Button/Button";
import { IoIosSearch } from "react-icons/io";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteChat,
  newChat,
  setSelectedChatId,
} from "../../Redux/Slices/messageSlice";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdDarkMode, MdLightMode, MdLogout } from "react-icons/md";
import { LuMonitorSmartphone } from "react-icons/lu";
import api from "../../config/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../Redux/Slices/userSlice";
import { setTheme } from "../../Redux/Slices/themeSlice";
import darklogo from "../../assets/darklogo.png";

const Sidebar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // Sidebar starts open
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const { chats, selectedChatId } = useSelector((state) => state.messages);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase()),
  );

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  // logout

  const logout = async () => {
    setLoggingOut(true);

    try {
      const res = await api.get("/api/auth/logout");

      dispatch(setUser(null));

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoggingOut(false);
    }
  };

  //  Logout All

  const logoutAll = async () => {
    setLoggingOut(true);

    try {
      const res = await api.get("/api/auth/logout-all");

      dispatch(setUser(null));

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoggingOut(false);
    }
  };

  //  Create New Chat

  const handleNewChat = async () => {
    try {
      const res = await api.post("/api/chat/create");

      dispatch(
        newChat({
          id: res.data.chat._id,
        }),
      );

      // Close mobile sidebar
      setSidebarOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Delete Chat
  const handleDeleteChat = async (chatId) => {
    try {
      const res = await api.delete(`/api/chat/${chatId}`);


      dispatch(deleteChat(chatId));

      toast.success("Chat deleted");
    } catch (error) {
      console.log("Delete error:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className={styles.mobileHeader}>
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <IoIosClose size={25} /> : <IoIosMenu size={25} />}
        </button>

        <div className={styles.mobileBrand}>
          <img src={theme === "light" ? logo : darklogo} alt="AskAI" />
        </div>
      </div>

      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section
        className={`${styles.sidebarContainer} ${
          sidebarOpen ? styles.open : ""
        }`}
      >
        {/* Logo */}

        <div className={styles.logoContainer}>
           <img src={theme === "light" ? logo : darklogo} alt="AskAI" />
        </div>

        {/* New Chat */}

        <Button
          onClick={handleNewChat}
          text="+  New Chat"
          className={styles.newchatBtn}
        />

        {/* Search */}

        <div className={styles.searchContainer}>
          <IoIosSearch size={20} className={styles.searchIcon} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search chats..."
          />
        </div>

        {/* Recents */}

        <h1>Recents</h1>

        <div className={styles.recentChats}>
          {filteredChats?.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                dispatch(setSelectedChatId(chat.id));

                // Close sidebar on mobile
                setSidebarOpen(false);
              }}
              className={`${styles.chat} ${
                selectedChatId === chat.id ? styles.active : ""
              }`}
            >
              <span className={styles.chatTitle}>{chat.title}</span>

              <span
                className={styles.delIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
              >
                <AiTwotoneDelete size={17} />
              </span>
            </div>
          ))}
        </div>

        {/* Profile */}

        <div
          className={styles.profile}
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <span>{firstLetter}</span>

          <div className={styles.userInfo}>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          {/* Profile Menu */}

          {openMenu && (
            <div
              className={styles.profileMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={styles.menuItem}
                onClick={() => dispatch(setTheme())}
              >
                {theme === "light" ? (
                  <>
                    <MdDarkMode size={18} />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <MdLightMode size={18} />
                    Light Mode
                  </>
                )}
              </div>

              <div className={styles.menuItem} onClick={logout}>
                <MdLogout size={18} />
                Logout
              </div>

              <div className={styles.menuItem} onClick={logoutAll}>
                <LuMonitorSmartphone size={18} />
                Logout from all devices
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Sidebar;

import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    chats: [],
    selectedChatId: null,
  },
  reducers: {
    newChat: (state, action) => {
      const chat = {
        id: action.payload.id,
        title: "New Chat",
        messages: [],
      };

      state.chats.push(chat);
      state.selectedChatId = chat.id;
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setMessages: (state, action) => {
      const chat = state.chats.find((chat) => chat.id === state.selectedChatId);

      if (chat) {
        chat.messages.push(action.payload);
      }
    },
    deleteChat: (state, action) => {
      const chatId = action.payload;
      state.chats = state.chats.filter((chat) => chat.id !== chatId);
      state.selectedChatId = null;
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);

      if (chat) {
        chat.title = title;
      }
    },
    setChats: (state, action) => {
  state.chats = action.payload;
},
  },
});

export const {
  newChat,
  setSelectedChatId,
  setMessages,
  deleteChat,
  setChats,
  updateChatTitle,
} = messageSlice.actions;
export default messageSlice.reducer;

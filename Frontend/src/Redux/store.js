import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice"
import messageSlice from "./Slices/messageSlice"
import themeSlice from "./Slices/themeSlice";


const store = configureStore({
  reducer: {
    user:userSlice,
    messages:messageSlice,
    theme:themeSlice,

  },
});


export default store;
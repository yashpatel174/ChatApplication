import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
  newMessagesAlert: [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCount += 1;
    },
    resetNotification: (state) => {
      state.notificationCount = 0;
    },
    setNewMessages: (state, action) => {
      const index = state.newMessagesAlert.findIndex((item) => item.chatId === action.payload.chatId);
      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      }
    },
  },
});

export default chatSlice;

export const { incrementNotification, resetNotification, setNewMessages } = chatSlice.actions;

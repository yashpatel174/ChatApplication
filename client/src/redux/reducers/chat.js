import { createSlice } from "@reduxjs/toolkit";
import { saveFromStorage } from "../../lib/features";
import { new_message_alert } from "../../constants/events";

const initialState = {
  notificationCount: 0,
  newMessagesAlert: saveFromStorage({ key: new_message_alert, get: true }) || [
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
    setNewMessagesAlert: (state, action) => {
      const chatId = action.payload.chatId;
      const index = state.newMessagesAlert.findIndex((item) => item.chatId === chatId);
      index !== -1 ? (state.newMessagesAlert[index].count += 1) : state.newMessagesAlert?.push({ chatId, count: 1 });
    },
    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter((item) => item.chatId !== action.payload);
    },
  },
});

export default chatSlice;

export const { incrementNotification, resetNotification, setNewMessagesAlert, removeNewMessagesAlert } = chatSlice.actions;

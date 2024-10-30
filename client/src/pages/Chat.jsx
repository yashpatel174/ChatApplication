import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { grayColor, orange } from "../constants/color";
import { new_message } from "../constants/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useSocket } from "../Socket";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";

const Chat = ({ chatId, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const containerRef = useRef(null);
  const socket = useSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessages = useGetMessagesQuery({ chatId, page });
  const dispatch = useDispatch();

  const { data: oldMsgs, setData: setOldMsgs } = useInfiniteScrollTop(containerRef, oldMessages?.data?.result?.totalPages, page, setPage, oldMessages.data?.result?.messages);

  const members = chatDetails?.data?.result.members;
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessages.isError, error: oldMessages.error },
  ];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(new_message, { chatId, members, message });
    setMessage("");
  };

  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data?.result?.message]);
  }, []);

  const newMessageAlert = useCallback((data) => {
    console.log(data);
  }, []);

  const eventHandler = { [new_message]: newMessagesHandler };
  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMsgs, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages?.map((i) => (
          <MessageComponent
            key={i._id}
            message={i}
            user={user}
          />
        ))}
      </Stack>
      <form
        style={{ height: "10%" }}
        onSubmit={handleSubmit}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here...."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu
        anchorE1={fileMenuAnchor}
        chatId={chatId}
      />
    </>
  );
};

export default AppLayout()(Chat);

import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";
import { serverURL } from "./constants/config";

const SocketContext = createContext();
const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(serverURL, { withCredentials: true }), []);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export { SocketProvider, useSocket };

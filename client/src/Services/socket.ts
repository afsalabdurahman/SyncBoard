// socket.ts
const SOCKET_CONNECTION = import.meta.env.VITE_BASE_SOCKET;
import { io } from "socket.io-client";
export const socket = io(SOCKET_CONNECTION, {
  withCredentials: true,
  transports: ["websocket"]

});

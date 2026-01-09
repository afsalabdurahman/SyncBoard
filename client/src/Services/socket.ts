// socket.ts

import { io } from "socket.io-client";
export const socket = io("https://api.syncworkspace.co.in", {
  withCredentials: true,
  transports: ["websocket"]

});

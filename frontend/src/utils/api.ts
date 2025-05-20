import axios from "axios";
import { io, Socket } from "socket.io-client";

export const getApiUrl = () => {
  return "/api";
};

export const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

let socket: Socket | null = null;

export function getIo(): Socket {
  if (!socket) {
    socket = io();
  }
  return socket;
}

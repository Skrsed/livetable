import { io } from "socket.io-client"

const {
  VITE_HOST,
  VITE_SERVER_PORT
} = import.meta.env

export const socket = io(`${VITE_HOST}:${VITE_SERVER_PORT}`, {
  transports: ['websocket'],
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
})



import { io } from "socket.io-client"
import { serverHost } from "@config"

const { VITE_SERVER_PORT } = import.meta.env

export const socket = io(`${serverHost}:${VITE_SERVER_PORT}`, {
  transports: ['websocket'],
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
})



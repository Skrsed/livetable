import { io } from "socket.io-client"

export const socket = io('http://backend:3000', {
  transports: ['websocket'],
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
})



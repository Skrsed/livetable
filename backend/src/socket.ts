import { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { Logger } from 'pino'

export const makeSocket = (log: Logger, server: HttpServer): SocketServer => {
    const {
        ORIGIN_HOST = 'http://backend',
        ORIGIN_PORT = '5173'
    } = process.env

    const io = new SocketServer(server, {
        cors: {
            origin: `${ORIGIN_HOST}:${ORIGIN_PORT}`,
            credentials: true
        },
        transports: ['websocket']
    })

    io.on('connection', () => {
        log.info('Socket connection established')
    })

    return io
}
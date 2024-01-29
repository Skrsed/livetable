import { Request, Response } from 'express'
import { Logger } from 'pino'
import { Server as SocketServer } from 'socket.io'

export interface Args {
    req: Request,
    res: Response,
    socket: SocketServer,
    log: Logger,
}
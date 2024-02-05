import { Router, Request, Response } from 'express'
import { all, count, create, fields, one, remove, update } from './api/item'
import { Logger } from 'pino'
import { Server as SocketServer } from 'socket.io'

const template = (
    {
        log,
        socket,
    }: {
        log: Logger,
        socket: SocketServer,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) => (func: (...args: any) => any) => (req: Request, res: Response) => func({ log, socket, req, res })

export const makeRoutes = (log: Logger, socket: SocketServer): Router => {
    const router = Router()

    // forward some useful params
    const make = template({ log, socket })

    router.post('/item/create', make(create))
    router.post('/item/all', make(all))
    router.put('/item/update/:id/', make(update))
    router.delete('/item/delete/:id/', make(remove))
    router.get('/item/count', make(count))
    router.get('/item/fields', make(fields))
    router.get('item/:id/', make(one))

    return router
}
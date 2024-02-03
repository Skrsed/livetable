import express, { Application, Response } from 'express'
import dotenv from 'dotenv'
import { createServer, Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { makeRoutes } from './router'
import { pino, Logger } from 'pino'
import { makeSocket } from './socket'
import { connectMongodb } from './db'
import { initErrorHandler, initSpec, makeDocsPage } from '../openapi/init'
import cors from 'cors'

//For env File 
dotenv.config()

const {
    APP_PORT = 3000
} = process.env

const logger: Logger = pino()

const run = async () => {
    await connectMongodb(logger)

    const app: Application = express()

    app.use(cors())
    app.use(express.json())

    initSpec(app)

    const server: HttpServer = createServer(app)

    const socket: SocketServer = makeSocket(logger, server)

    app.use('/api/v1/', makeRoutes(logger, socket))

    app.get('/', (_, req: Response) => req.send('healthcheck succeed!'))

    initErrorHandler(app)
    makeDocsPage(app)

    server.listen(APP_PORT, () => {
        logger.info(`Server is Fire at http://localhost:${APP_PORT}`)
    })
}

run()

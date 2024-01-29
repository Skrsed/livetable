import { connect } from 'mongoose'
import { Logger } from 'pino'

const {
    MONGO_USER = 'root',
    MONGO_PASSWORD = 'example',
    MONGO_HOST = 'localhost',
    MONGO_PORT = '27017',
    MONGO_DB = 'app'
} = process.env

export const connectMongodb = async (log: Logger) => {
    try {
        await connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`, {
            dbName: MONGO_DB
        })

        log.info('Mongo connection established!')
    } catch (e: unknown) {
        log.error(e)

        process.exit(1)
    }
}

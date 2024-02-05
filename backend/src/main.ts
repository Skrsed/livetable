import { makeApp } from './init'

const {
    APP_PORT = 3000
} = process.env

makeApp().then(({ app, logger }) => {
    app.listen(APP_PORT, () => {
        logger.info(`Server is Fire at http://localhost:${APP_PORT}`)
    })
})



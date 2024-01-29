import { Application } from 'express'
import * as fs from 'fs'
import * as OpenApiValidator from 'express-openapi-validator'
import { parse } from 'yamljs'
import SwaggerUI from 'swagger-ui-express'
import { ErrorRequestHandler } from 'express'

export const initSpec = (app: Application) => {
    app.use(
        OpenApiValidator.middleware({
            apiSpec: './openapi/spec.yml',
            validateRequests: true, // (default)
            validateResponses: true, // false by default
        }),
    )
}
export const initErrorHandler = (app: Application) => {
    const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
        // format error
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        })
    }

    app.use(errorHandler)
}
export const makeDocsPage = (app: Application) => {
    // TODO: relative path
    const file = fs.readFileSync('./openapi/spec.yml', 'utf8')
    const swaggerDocument = parse(file)

    app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument))
}
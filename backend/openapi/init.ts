import { Application } from 'express'
import * as fs from 'fs'
import * as OpenApiValidator from 'express-openapi-validator'
import { parse } from 'yamljs'
import SwaggerUI from 'swagger-ui-express'
import { ErrorRequestHandler } from 'express'
import { inspect } from 'util'

export const initSpec = (app: Application) => {
    // app.use(
    //     OpenApiValidator.middleware({
    //         apiSpec: './openapi/spec.yml',
    //         validateRequests: true, // (default)
    //         validateResponses: true, // false by default
    //     }),
    // )
}

export const initErrorHandler = (app: Application) => {
    // const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
    //     // format error
    //     res.status(err.status || 500).json({
    //         message: err.message,
    //         errors: err.errors,
    //         res: JSON.stringify(inspect(res), null, 2),
    //         reqParams: JSON.stringify(inspect(req.params), null, 2),
    //         reqBody: JSON.stringify(inspect(req.body), null, 2)
    //     })
    // }

    // app.use(errorHandler)
}

export const makeDocsPage = (app: Application) => {
    // TODO: relative path
    const file = fs.readFileSync('./openapi/spec.yml', 'utf8')
    const swaggerDocument = parse(file)

    app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument))
}

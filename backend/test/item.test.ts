import request from 'supertest'
import { makeApp } from '../src/init'
import { Server as HttpServer } from 'http'
import { Logger } from 'pino'
import { Item } from '../src/models/Item'
import { disconnectMongodb } from '../src/db'

let appInstance: Promise<{ app: HttpServer, logger: Logger }> | null = null

const testApp = async (): Promise<{ app: HttpServer, logger: Logger }> => {
    if (!appInstance) {
        appInstance = makeApp()
    }

    return appInstance
}

describe('items test', () => {
    afterAll(disconnectMongodb)

    const testRecord = {
        firstname: 'John',
        lastname: 'Doe',
        phone: '88005553535'
    }

    describe('POST /api/v1/item/create', () => {
        it('should add record to db', async () => {
            const { app } = await testApp()

            const res = await request(app)
                .post('/api/v1/item/create')
                .send({ fields: { name: 'John Doe', phone: '+79248764523' } })

            expect(res.statusCode).toBe(201)
        })

        // ...
    })

    describe('POST /api/v1/item/all', () => {
        it('should get records from db', async () => {
            const { app } = await testApp()

            await request(app)
                .post('/api/v1/item/create')
                .send({ fields: testRecord })

            const res = await request(app)
                .post('/api/v1/item/all')
                .send({ page: 1, itemsPerPage: 15 })

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        fields: expect.any(Object)
                    })
                ])
            )
        })
    })

    describe('PUT /api/v1/item/update', () => {
        it('should update record to db', async () => {
            const { app } = await testApp()

            // create some item if db still empty
            await request(app)
                .post('/api/v1/item/create')
                .send({ fields: testRecord })

            // get some record to update
            const records = await request(app)
                .post('/api/v1/item/all')
                .send({ page: 1, itemsPerPage: 15 })

            const someId = records.body[0]._id

            const updateData = { updated: 'updated' }

            // update without errors
            const res = await request(app)
                .put(`/api/v1/item/update/${someId}`)
                .send({ fields: updateData })

            // get this item from outher endpoint to check content
            const check = await request(app)
                .get(`/api/v1/item/${someId}`)

            console.log(res.body)

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                _id: someId,
                fields: updateData
            })
            expect(check.body).toEqual(res.body)
        })

        // ...
    })
})
import request from 'supertest'
import { makeApp } from '../src/init'
import { Server as HttpServer } from 'http'
import { Logger } from 'pino'
import { ItemModel } from '../src/models/Item'
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

    beforeEach(async () => {
        await testApp()
        await ItemModel.deleteMany({})
    })

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
                .send({ name: 'John Doe', phone: '+79248764523' })

            expect(res.statusCode).toBe(201)
        })

        // ...
    })

    describe('POST /api/v1/item/all', () => {
        it('should get records from db', async () => {
            const { app } = await testApp()

            // create some item if db still empty
            await request(app)
                .post('/api/v1/item/create')
                .send({ testRecord })

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

        // ...
    })

    describe('PUT /api/v1/item/update', () => {
        it('should update record to db', async () => {
            const { app } = await testApp()

            // create some item if db still empty
            await request(app)
                .post('/api/v1/item/create')
                .send({ testRecord })

            // get some record to update
            const records = await request(app)
                .post('/api/v1/item/all')
                .send({ page: 1, itemsPerPage: 15 })

            const someId = records.body[0]._id

            const updateData = { updated: 'updated' }

            // update without errors
            const res = await request(app)
                .put(`/api/v1/item/update/${someId}`)
                .send(updateData)

            // get this item from other endpoint to check content
            const check = await request(app)
                .get(`/api/v1/item/one/${someId}`)

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                _id: someId,
                fields: updateData,
                __v: 0
            })
            expect(check.body).toEqual(res.body)
        })

        // ...
    })

    describe('DELETE /api/v1/item/delete', () => {
        it('should delete record by id', async () => {
            const { app } = await testApp()

            // create some item if db still empty
            await request(app)
                .post('/api/v1/item/create')
                .send({ testRecord })

            // get some record to delete
            const records = await request(app)
                .post('/api/v1/item/all')
                .send({ page: 1, itemsPerPage: 15 })

            const someId = records.body[0]._id

            // check this item exists from other endpoint 
            const check = await request(app)
                .get(`/api/v1/item/one/${someId}`)
            expect(check.body._id).toEqual(someId)

            // try to delete
            const res = await request(app)
                .delete(`/api/v1/item/delete/${someId}`)

            expect(res.statusCode).toBe(204)

            // check this item deleted from other endpoint 
            const secondCheck = await request(app)
                .get(`/api/v1/item/one/${someId}`)
            expect(secondCheck.body).toEqual({})
        })
    })

    describe('GET /api/v1/item/one/:id', () => {
        it('should get single record by id', async () => {
            const { app } = await testApp()

            await request(app)
                .post('/api/v1/item/create')
                .send({ name: 'John Doe', phone: '+79248764523' })

            // get some record to check
            const records = await request(app)
                .post('/api/v1/item/all')
                .send({ page: 1, itemsPerPage: 15 })

            const single = records.body[0]

            const res = await request(app)
                .get(`/api/v1/item/one/${single._id}`)

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual(single)
        })

        // ...
    })

    describe('GET /api/v1/item/fields', () => {
        it('should get fields of all records', async () => {
            const { app } = await testApp()

            await Promise.all([
                request(app)
                    .post('/api/v1/item/create')
                    .send({ name: 'John Doe', phone: '+79248764523' }),
                request(app)
                    .post('/api/v1/item/create')
                    .send({ test: 'test' }),
                request(app)
                    .post('/api/v1/item/create')
                    .send({ name: 'John Doe', email: 'john.doe@skrsed.com' })
            ])

            const res = await request(app)
                .get('/api/v1/item/fields')

            expect(res.statusCode).toBe(200)
            expect(res.body.sort()).toEqual(['email', 'test', 'phone', 'name'].sort())
        })

        // ...
    })
})
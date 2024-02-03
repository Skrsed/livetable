import type { Item } from "@/stores/types"
import { serverHost } from '@config'

const { VITE_SERVER_PORT } = import.meta.env

interface RequestArgs {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: object,
    endpoint: string
}

export interface Pagination {
    page: number,
    itemsPerPage: number
}

const request = ({ method, endpoint, body: requestBody }: RequestArgs) => {
    const body = JSON.stringify(requestBody)

    // TODO: env
    // eslint-disable-next-line max-len
    return fetch(`${serverHost}:${VITE_SERVER_PORT}/api/v1/${endpoint}`, {
        method,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        referrerPolicy: 'no-referrer',
        body,
    })
}

const all = async (body: Pagination): Promise<Item[]> => {
    const res = await request({
        method: 'POST',
        endpoint: 'item/all',
        body
    })

    return await res.json()
}

const count = async (): Promise<number> => {
    const res = await request({
        method: 'GET',
        endpoint: 'item/count',
    })

    return await res.json()
}

const fields = async (): Promise<Array<string>> => {
    const res = await request({
        method: 'GET',
        endpoint: 'item/fields'
    })

    return await res.json()
}

const create = ({ fields }: { fields: object }) => {
    return request({
        method: 'POST',
        endpoint: 'item/create',
        body: fields
    })
}

const update = ({ id, fields }: { id: string, fields: object }) => {
    return request({
        method: 'PUT',
        endpoint: `item/update/${id}`,
        body: { fields }
    })
}

const remove = ({ id }: { id: string }) => {
    return request({
        method: 'DELETE',
        endpoint: `item/delete/${id}`,
    })
}

export const query = {
    all,
    create,
    update,
    remove,
    count,
    fields
}
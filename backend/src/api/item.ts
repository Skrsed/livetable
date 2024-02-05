import { allFields, allItems, allItemsCount, createItem, deleteItem, singleItem, updateItem } from '../models/Item'
import { Args } from '../types/common'

export const all = async ({ res, req }: Args): Promise<void> => {
    const {
        page,
        itemsPerPage
    }: { page: number, itemsPerPage: number } = req.body
    const items = await allItems({
        offset: page - 1,
        limit: itemsPerPage,
    })

    res.send(items)
}

export const one = async ({ res, req }: Args): Promise<void> => {
    const { id } = req.params

    const item = await singleItem({
        id
    })

    res.send(item)
}

export const count = async ({ res }: Args): Promise<void> => {
    const count = await allItemsCount()

    res.send(count.toString())
}

export const create = async ({ req, res, socket, log }: Args): Promise<void> => {
    log.info('create item')

    const {
        ...fields
    } = req.body

    await createItem(fields)

    // Why we're not emiting changes directly, but only notify frontends?

    // There is because table may have pagination(or frontend will be dead on rerender)/sort/search/etc.
    // In that case solution will be too much complicated, KISS for now ;)
    socket.emit('item:change')

    res.status(201).send()
}

export const remove = async ({ req, res, socket, log }: Args): Promise<void> => {
    const { id } = req.params

    log.info(`delete item ${id}`)

    await deleteItem(id)

    socket.emit('item:change')

    res.status(204).send()
}

export const update = async ({ log, req, res, socket }: Args): Promise<void> => {
    const { fields } = req.body
    const { id } = req.params

    log.info(`update item ${id}`)

    const newItem = await updateItem({ _id: id, fields })

    socket.emit('item:change')

    res.send(newItem)
}

export const fields = async ({ res }: Args): Promise<void> => {
    const [{ fields }] = await allFields()

    res.send(fields)
}
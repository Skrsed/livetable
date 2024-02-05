import { Schema, model } from 'mongoose'

export interface Item {
    _id: string,
    fields: object,
}

interface SearchParams {
    offset: number,
    limit: number,
}

export const itemSchema = new Schema<Item>({
    fields: Object
})

export const ItemModel = model<Item>('Item', itemSchema)

export const allItems = ({
    offset,
    limit
}: SearchParams) => {
    // TODO: use some external search/sort solution, mb elastic search
    return ItemModel
        .find({})
        .skip(offset * limit)
        .limit(limit)
        .exec()
}

export const singleItem = ({ id }: { id: string }) => {
    return ItemModel
        .findById(id)
        .exec()
}

export const allItemsCount = () => {
    return ItemModel
        .countDocuments({})
}

// TODO: fix that
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createItem = (fields: object): any => {
    const record = new ItemModel({ fields })

    return record.save()
}

// make type
export const updateItem = ({ _id, fields }: Item) => {
    return ItemModel.findByIdAndUpdate(_id, { fields }, { new: true }).exec()
}

export const deleteItem = (id: string) => {
    return ItemModel.findByIdAndDelete(id).exec()
}

export const allFields = () => {
    return ItemModel.aggregate([
        {
            $project: {
                data: {
                    $objectToArray: '$fields'
                }
            }
        },
        {
            $project: {
                data: '$data.k'
            }
        },
        {
            $unwind: '$data'
        },
        {
            $group: {
                _id: null,
                fields: {
                    $addToSet: '$data'
                }
            }
        }
    ])
}
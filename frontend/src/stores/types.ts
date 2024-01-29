export interface Item {
    _id: string,
    fields: object
}

export interface ItemForm {
    key: string,
    value: string
}

export enum State {
    None,
    Create,
    Update,
    Read,
}
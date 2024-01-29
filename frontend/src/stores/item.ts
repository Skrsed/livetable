import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { type Item, State, type ItemForm } from './types'
import { query, type Pagination } from '@/api/item'
import { socket } from '@/socket'

const items = ref<Item[]>([])
const selectedItemId = ref<string | null>(null)
const state = ref<State>(State.None)
const isDrawerOpen =  ref<boolean>(false)
const isLoadingDrawer = ref<boolean>(false)
const isLoadingTable = ref<boolean>(true)
const itemsPerPage = ref<number>(15)
const page = ref<number>(1)
const totalItems = ref<number>(0)

const tableItems = computed(
    () => items.value.map(
        ({_id, fields}, i) => ({
            // make some autoincrement
            number: (page.value - 1) * itemsPerPage.value + i,
            _id,
            ...fields
        })
    )
)

const pagination = computed(
    (): Pagination => ({
        itemsPerPage: itemsPerPage.value,
        page: page.value,
        // sort, search, etc.
    })
)

function openDrawer(itemId: string | null, action: State) {
    state.value = action
    isDrawerOpen.value = true
    selectedItemId.value = itemId
}

function closeDrawer() {
    state.value = State.None
    isDrawerOpen.value = false
    selectedItemId.value = null
}

function switchToEdit() {
    state.value = State.Update
}

function switchToRead() {
    state.value = State.Read
}

function saveItem(items: ItemForm[]) {
    const fields = items.reduce(
        (acc: {[key: string]: string}, {key, value}) => {
        acc[key] = value

        return acc
    }, {}) 
    if (selectedItemId.value === null && state.value === State.Create) {
        createItem(fields)
        return
    }

    updateItem(fields)
}

function bindEvents() {
    socket.on('connect', () => {
        console.log('socket connected')
    })

    socket.on('item:change', () => {
        getItems(pagination.value)
    })
}

async function getItems(args: Pagination) {
    isLoadingTable.value = true

    try {
        // set page and itemsPerPage from table callback
        page.value = args.page
        itemsPerPage.value = args.itemsPerPage

        _getItems(args)
        
    } catch (e: any) {
        console.error('Error while getting items')
    } finally {
        isLoadingTable.value = false
    }
}

async function _getItems(args: Pagination) {
    try {
        const [itemRes, itemCount] = await Promise.all([
            query.all(args),
            query.count()
        ])

        items.value = itemRes
        totalItems.value = itemCount
    } catch (e: any) {
        console.error('Error while getting items')
    }
}

async function createItem(fields: object) {
    try {
        isLoadingDrawer.value = true
        await query.create({ fields })

        // _getItems(pagination.value)
    } catch (e: any) {
        console.error(e)
    } finally {
        isLoadingDrawer.value = false
        closeDrawer()
    }
}

async function updateItem(fields: object) {
    try {
        isLoadingDrawer.value = true
        if (!selectedItemId.value) {
            throw new Error('Shouldn\'t be empty')
        }

        await query.update({ id: selectedItemId.value, fields })

        // ._getItems(pagination.value)
    } catch (e: any) {
        console.error(e)
    } finally {
        isLoadingDrawer.value = false
        closeDrawer()
    }
}

async function deleteItem() {
    try {
        isLoadingTable.value = true

        if (!selectedItemId.value) {
            throw new Error('Shouldn\'t be empty')
        }

        await query.remove({ id: selectedItemId.value })

        // _getItems(pagination.value)
    } catch (e: any) {
        console.error(e)
    } finally {
        isLoadingTable.value = false
        closeDrawer()
    }
}

export const useItemStore = defineStore('item', () => ({
    // state
    items,
    isLoadingTable,
    isLoadingDrawer,
    state,
    isDrawerOpen,
    selectedItemId,
    itemsPerPage,
    totalItems,
    // getters
    tableItems,
    // actions
    bindEvents,
    //CRUD
    saveItem,
    createItem,
    getItems,
    updateItem,
    deleteItem,
    // helpers
    openDrawer,
    closeDrawer,
    switchToEdit,
    switchToRead
}))
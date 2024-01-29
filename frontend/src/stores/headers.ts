import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { query } from '@/api/item'

const _headers = ref<string[]>([])
const isDrawerOpen =  ref<boolean>(false)
const isLoadingDrawer = ref<boolean>(false)
const _selectedFields = ref<string[]>(getSelectedFields())

const selectedHeaders = computed(
    () => {
        return _selectedFields.value.map((title: string) => ({
            key: title,
            title
        }))
    }
)

const headers = computed(
    () => [
        ...new Set([
            ..._headers.value,
            ..._selectedFields.value
        ])
    ]
)

const selectedFields = computed({
    get: () => _selectedFields.value,
    set: saveSelectedFields
})

function getSelectedFields () {
    const selected = localStorage.getItem('selectedFields')

    if (selected === null) {
        return []
    }

    return JSON.parse(selected)
}

async function getFields() {
    try {
        isLoadingDrawer.value = true
        _headers.value = await query.fields()
    } catch (e: any) {
        console.error(e)
    } finally {
        isLoadingDrawer.value = false
    }
}

function saveSelectedFields(fromInputSelected: string[]) {
    _selectedFields.value = fromInputSelected
    localStorage.setItem(
        'selectedFields',
        JSON.stringify(_selectedFields.value)
    )
}

function toggleDrawer() {
    if (isDrawerOpen.value) {
        isDrawerOpen.value = false
        return
    }

    isDrawerOpen.value = true
    getFields()
}

export const useHeadersStore = defineStore('header', () => ({
    /// state
    isDrawerOpen,
    // getters
    headers,
    selectedFields,
    selectedHeaders,
    // actions
    getFields,
    toggleDrawer,
    saveSelectedFields
}))
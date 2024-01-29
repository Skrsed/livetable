<script setup lang="ts">
import { useItemStore } from '@/stores/item'
import { storeToRefs } from 'pinia'
import UpsertForm from './UpsertForm.vue'
import ViewData from './ViewData.vue'
import { State } from '@/stores/types'
import { computed, watch, ref } from 'vue'
import {v4 as uuidv4} from 'uuid'

const itemStore = useItemStore()
const {
    selectedItemId,
    state 
} = storeToRefs(itemStore)

const isToggled = computed({
    get: () => itemStore.isDrawerOpen,
    set: () => itemStore.closeDrawer()
})

const form = ref<{ uuid: string, key: string, value: string }[]>([])

const addItem = () => {
    form.value = [{
        uuid: uuidv4(),
        key: '',
        value: '',
    }, ...form.value]
}

const deleteItem = (key: string) => {
    form.value = form.value.filter(({ uuid }: { uuid: string }) => key !== uuid)
}

watch(state, () => {
    if (!selectedItemId.value) {
        form.value = []
        return
    }

    const needle = itemStore.items
        .find(({ _id }) => _id === selectedItemId.value)

    if (!needle) {
        throw new Error('This shouldn\'t be empty')
    }

    form.value = Object.entries(needle.fields)
        .map(([key, value]: [key: string, value: string]) =>
            ({ uuid: uuidv4(), key, value }))

})

</script>
<template>
<v-navigation-drawer v-model="isToggled"
    temporary
    clipped
    fixed
    location="right"
    :width="600">
    <UpsertForm
        v-if="state === State.Update"
        :form="form"
        :addItem="addItem"
        :deleteItem="deleteItem"
    />
    <UpsertForm
        v-if="state === State.Create"
        :form="form"
        :addItem="addItem"
        :deleteItem="deleteItem"
    />
    <ViewData
        v-if="state === State.Read"
        :form="form"
    />
</v-navigation-drawer>
</template>
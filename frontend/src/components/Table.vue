<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useHeadersStore } from '@/stores/headers';
import { useItemStore } from '@/stores/item'
import { State } from '@/stores/types';
import { storeToRefs } from 'pinia'
import { computed } from 'vue';
import { onMounted } from 'vue'

const itemStore = useItemStore()
const headersStore = useHeadersStore()

const {
    itemsPerPage,
    totalItems,
    isLoadingTable,
    tableItems
} = storeToRefs(itemStore)

const {
    selectedHeaders
} = storeToRefs(headersStore)

const headers = computed(
    () => [
        {title: '#', key: 'number'},
        ...selectedHeaders.value,
        {title: '', key: 'actions', sortable: false}
    ]
)

onMounted(() => {
    itemStore.getItems({
        page: 1,
        itemsPerPage: 15
    })
})
</script>
<template>
<v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="tableItems"
    :loading="isLoadingTable"
    @update:options="itemStore.getItems"
    class="table"
>
    <!-- eslint-disable vue/valid-v-slot -->
    <template v-slot:header.actions="{}">
        <v-btn 
            icon="mdi-tag-edit"
            variant="plain"
            @click="() => headersStore.toggleDrawer()"
        ></v-btn>
    </template>
    <!-- eslint-disable vue/valid-v-slot -->
    <template v-slot:item.actions="{ item }">
        <v-btn 
            icon="mdi-play-box-outline"
            variant="plain"
            @click="() => itemStore.openDrawer(item._id, State.Read)"
        ></v-btn>
    </template>
</v-data-table-server>
</template>
<style scoped>
.table {
    height: 100%;
}
</style>
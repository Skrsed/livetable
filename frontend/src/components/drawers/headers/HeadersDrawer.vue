<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHeadersStore } from '@/stores/headers'

const headersStore = useHeadersStore()
const {
    isDrawerOpen,
    selectedFields,
    headers
} = storeToRefs(headersStore)

</script>
<template>
<v-navigation-drawer v-model="isDrawerOpen"
    temporary
    clipped
    fixed
    location="right"
    :width="600">
    <v-autocomplete
        clearable
        chips
        label="Autocomplete"
        v-model="selectedFields"
        :items="headers"
        multiple
    ></v-autocomplete>
</v-navigation-drawer>
</template>
<script setup lang="ts">
import Table from '@/components/Table.vue'
import ItemDrawer from '@/components/drawers/item/ItemDrawer.vue'
import HeadersDrawer from './components/drawers/headers/HeadersDrawer.vue'
import { useItemStore } from "@/stores/item"
import { socket } from "@/socket"
import { State } from './stores/types'

const itemStore = useItemStore();

// remove any existing listeners (after a hot module replacement)
socket.off();

itemStore.bindEvents()

const buttonColor = 'text-amber-darken-4'

</script>

<template>
<v-app>
    <ItemDrawer />
    <HeadersDrawer />
    <v-app-bar
        fixed
        hide-on-scroll
    >
        <v-btn
            rounded="xl"
            size="x-large"
            prepend-icon="mdi-plus-circle"
            width="200px"
            @click="() => itemStore.openDrawer(null, State.Create)"
        >
            Add new
        </v-btn>
        <v-btn
            :class="[
                'ml-auto',
                buttonColor
            ]"
            rounded="xl"
            size="x-large"
            icon="mdi-refresh-auto"
        >
        </v-btn>
    </v-app-bar>
    <v-main class="d-flex align-center justify-center">
        <Table />
    </v-main>
    
</v-app>
</template>

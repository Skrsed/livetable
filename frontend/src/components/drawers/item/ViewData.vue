<script setup lang="ts">
import { useItemStore } from '@/stores/item'

const props = defineProps<{
    form: Array<any>,
}>()

const itemStore = useItemStore()

</script>
<template>
<v-list-item>
    <v-row class="pa-2">
        <v-col cols="3">
            <v-btn
                prepend-icon="mdi-pencil"
                variant="plain"
                @click="itemStore.switchToEdit"
            >
                Edit
            </v-btn>
        </v-col>
        <v-col cols="3">
            <v-btn
                class="ml-auto"
                variant="plain"
                prepend-icon="mdi-delete"
                @click="itemStore.deleteItem"
            >
                Delete
            </v-btn>
        </v-col>
    </v-row>
</v-list-item>
<v-divider></v-divider>
<v-list-item
    v-for="field in props.form"
    v-bind:key="field.key"
>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title
                    class="text-h6 text-md-h5 text-lg-h4"
                >
                    {{ field.key }}
                </v-card-title>
                <v-card-text>
                    {{ field.value }}
                </v-card-text>
            </v-card>
                        
        </v-col>
    </v-row>
</v-list-item>
</template>
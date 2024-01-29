<script setup lang="ts">
import { useItemStore } from '@/stores/item'

const props = defineProps<{
    form: Array<any>,
    addItem: () => void,
    deleteItem: (key: string) => void
}>()

const rules = [
    (value: String) => {
        if (value) return true

        return 'required'
    }
]

const itemStore = useItemStore()

</script>
<template>
<!-- TODO: make it sticky -->
<v-list-item>
    <v-row class="pa-2">
        <v-col cols="3">
            <v-btn 
                prepend-icon="mdi-backspace"
                variant="plain"
                @click="itemStore.switchToRead"
            >
                Cancel
            </v-btn>
        </v-col>
        <v-col cols="3">
            <v-btn
                variant="plain"
                prepend-icon="mdi-plus-circle"
                @click="props.addItem"
            >
                Add
            </v-btn>
        </v-col>
        <v-col cols="3">
            <v-btn
                class="ml-auto"
                variant="plain"
                prepend-icon="mdi-content-save-all"
                @click="() => itemStore.saveItem(props.form)"
            >
                Save
            </v-btn>
        </v-col>
    </v-row>
</v-list-item>
<v-divider></v-divider>
<v-form
    @submit.prevent
    class="pt-4"
>
    <v-list-item
        v-for="(field, index) in props.form"
        v-bind:key="index"
    >
        <v-row>
            <v-col cols="5">
                <v-text-field v-model="field.key"
                    :rules="rules"
                    class="mb-2"
                    clearable
                    label="key"
                ></v-text-field>   
            </v-col>
            <v-col cols="7">
                <v-text-field v-model="field.value"
                    :rules="rules"
                    class="mb-2"
                    clearable
                    label="value"
                    append-icon="mdi-delete"
                    @click:append="() => props.deleteItem(field.uuid)"
                ></v-text-field>   
            </v-col>
        </v-row>
    </v-list-item>
</v-form>
</template>
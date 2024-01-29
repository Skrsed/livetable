To exclude (looking) empty rows
```ts
return ItemModel
    .find({
        $or: [
            ...fieldsConditions
        ]
    })
    .exec()
```
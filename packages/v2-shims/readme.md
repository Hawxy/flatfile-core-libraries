# @flatfile/v2-shims

## Convert Your Schema

Pass in your current schema or a license key (with optional batch Id) to convert a schema to a Blueprint
```js From V2 Schema Object
const v2Schema = {
    type: 'Contact',
    fields: [
        {
            key: 'name',
            label: 'Name'
        }
    ]
}
const blueprint = schemaConverter({ schema: v2Schema })
```
```js From License Key
const blueprint = schemaConverter({ licenseKey: 'YOUR_V2_LICENSE_KEY' })
```
```js From License Key and Batch
const blueprint = schemaConverter({ licenseKey: 'YOUR_V2_LICENSE_KEY', batchId: 'Batch_ID' })
```

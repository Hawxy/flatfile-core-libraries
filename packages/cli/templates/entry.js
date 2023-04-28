const { Client, FlatfileVirtualMachine } = require('@flatfile/listener')
const mount = require('{ENTRY_PATH}')
const client = Client.create(mount)
client.mount(new FlatfileVirtualMachine())
module.exports = client

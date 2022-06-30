import { ColumnMapping, SchemaTest } from "@flatfile/platform-sdk/schema/SchemaTest"

const testMapping: ColumnMapping = { id: 'id', name: 'first_name', lastName: 'last_name', admin: 'is_admin' };
const sc = new SchemaTest(
	"first describe",
	testMapping,
	{
		fields: [
			{ type: 'string', label: 'First Name', field: 'first_name', required: true, },
			{ type: 'string', label: 'Last Name', field: 'last_name', required: true },
			{ type: 'number', label: 'Id', field: 'id', required: true, primary: true },
			{ type: 'boolean', label: 'Is Admin', field: 'is_admin', required: false }]
	});

sc.testRow([{ 'id': 'asdf', 'name': 'peter', 'lastname': 'Doe' }, { 'id': false }], "first it statement");
sc.testRow([{ 'id': '0' }, { 'id': true }], "second it statement");

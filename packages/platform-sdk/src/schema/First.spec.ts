import { IJsonSchema } from "@flatfile/platform-sdk/types/ISchema";
import { DDLSchema, DDLCompile, DDLSimpleField } from "@flatfile/platform-sdk/schema/First";

const jsonSchema: IJsonSchema = {
	properties: {
		first_name: { type: 'string', label: 'First Name', field: 'first_name' },
		last_name: { type: 'string', label: 'Last Name', field: 'last_name' },
		id: { type: 'number', label: 'Id', field: 'id' },
		is_admin: { type: 'boolean', label: 'Is Admin', field: 'is_admin' },
	},
	type: 'object',
    required: ['first_name', 'last_name', 'id'],
	unique: ['id'],
	primary: 'id',
}

const ddlSchema:DDLSchema = {
    fields: [
	{ type: 'string', label: 'First Name', field: 'first_name', required: true, },
	{ type: 'string', label: 'Last Name', field: 'last_name', required: true },
	{ type: 'number', label: 'Id', field: 'id', required: true, primary: true },
	{ type: 'boolean', label: 'Is Admin', field: 'is_admin', required: false }]};

describe("compiler tests", () => {
    it('tests a records validity on import',  () => {
	expect(DDLCompile(ddlSchema)).toStrictEqual(jsonSchema);
	})
})

//import { ColumnMapping, SchemaTest } from "../schema/SchemaTest"
import { ColumnMapping, SchemaTest } from "../schema/SchemaTest"
import { Record } from "../DataAbstraction/Record"

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
	},
    {
            onChange(record:Record, session,logger) {
          const fName = record.get("first_name");
          logger.info(`last_name was ${record.get("last_name")}`);
          record
            .set("last_name", fName)
            .addInfo("last_name", 'last_name was ' + record.get("last_name"));
          return record;
        },
      });



sc.testHook("records/change")
  .expectData(
    [{ first_name: "peter", last_name: "Doe" }],
    [{ first_name: "peter", last_name: "peter" }]
  )
  .expectComments([{ last_name: "last_name was Doe" }]);


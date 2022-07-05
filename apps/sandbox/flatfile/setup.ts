import { Sheet, TextField } from '@flatfile/configure'

const Contact = new Sheet(
  "Contact",
  {
    firstName: TextField("First Name", {
      required: true,
      description: "foo",
    }),
    lastName: TextField(),
    email: EmailField(),
    phoneNumber: TextField(),
    startDate: TextField(),
    testField: TextField(),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    onChange(record, session,logger) {
      const fName = record.get("firstName");
      logger.info(`lastName was ${record.get("lastName")}`);
      record.set("lastName", fName);
      return record;
    },
  }
);

const OtherContact = new Sheet(
  "OtherContact",
  {
    firstName: TextField("First Name", {
      required: true,
      description: "foo",
    }),
    lastName: TextField(),
    email: EmailField(),
    phoneNumber: TextField(),
    startDate: TextField(),
    testField: TextField(),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    onChange(record, session,logger) {
      const fName = record.get("firstName");
      logger.info(`lastName was ${record.get("lastName")}`);
      record.set("lastName", fName);
      return record;
    },
  }
);

export default new Workbook({
  name: "Contact Onboarding",
  namespace: "onboarding-1",
  models: {
    Contact,
    OtherContact
  },
});

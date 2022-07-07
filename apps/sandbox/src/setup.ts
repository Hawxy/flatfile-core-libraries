import { EmailField, Sheet, TextField, Workbook } from '@flatfile/configure'

const Contact = new Sheet(
  'Contact',
  {
    firstName: TextField({
      required: true,
      description: 'foo',
    }),
    lastName: TextField(),
    email: EmailField({
      nonPublic: true,
      onValue: (v) => v.toUpperCase(),
    }),
    phoneNumber: TextField(),
    startDate: TextField(),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    onChange(record) {
      const fName = record.get('firstName')
      console.log(`lastName was ${record.get('lastName')}`)
      record.set('lastName', fName)
      return record
    },
  }
)

export default new Workbook({
  name: 'Contact Onboarding',
  namespace: 'onboarding',
  sheets: {
    contact: Contact,
  },
})

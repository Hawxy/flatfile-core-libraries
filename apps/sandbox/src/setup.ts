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
    onChange(record, session, logger) {
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

// ContactOnboardingWorkbook.toJSONSchema(session) // => produces raw JSON / Text = stored in database

// // - after manual transform
// // - - onChange:OfficialAddressV1Normalize
// // - - onChange:anonymous

// ContactOnboardingWorkbook.routeEvents(event, {
//   target: ['change', 'runtime', '8y9843hyiouahsdf'],
// })

// ContactOnboardingWorkbook.getHook('contact', [
//   'change',
//   'runtime',
//   '8y9843hyiouahsdf',
// ]) // => () =>

// many possible events here

// execution
// | 1. Field Soft Cast
// | Field Compute
// | Row Transform '2020-01-01'
//   | Field Hard Cast
//   | Field Compute
// |

//
// () 1 -> () 2 -> () 3 ()
// cast -> compute -> validate
//
//
// onCast
// onBulkCast
// beforeCast
// afterCast
//
// date
// "later" -> cast fails -> custom cast (later = new Date('next year')) -> compute -> validate
//
// boolean
// "nein" -> raw cast fails -> custom cast = false -> compute -> validate

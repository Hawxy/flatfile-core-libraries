import { EmailField, Sheet, TextField, Workbook } from '@flatfile/configure'

const Contact = new Sheet(
  'Contact',
  {
    firstName: TextField('First Name', {
      required: true,
      description: 'foo',
    }),
    lastName: TextField(),
    email: EmailField({
      // onChange(value: Atom | Cell, row: Row) {
      //   value.addMessage()
      //   // complex logic
      // },
      // onTransform: HighCPU((batch: string[]): string[] => {
      //   // call API
      //   batch.map()
      // }),
      // onValidate(value?: Date) {
      //   // metadata
      //   // some foo bar return errors
      // },
    }),
    phoneNumber: TextField(),
    startDate: TextField(),

    testField: TextField(),
    // fooField: TextField({ internal: true }),
  },
  {
    allowCustomFields: true,
    readOnly: true,
    // hooks: {
    //   transform(castRow: { startDate: Date }) {
    //     // move data around but always honor the right type
    //   },
    //   compute(value?: Date, row) {
    //     if (!value) {
    //       return new Date()
    //     }
    //   },
    //   validate(value?: Date): Date {
    //     if (value > new Date()) {
    //       throw new Error("You can't be an idiot")
    //     }
    //   },
    //   render(value: Date) {
    //     return value.toLocaleDateString()
    //   },
    // },
    onChange(record, session, logger) {
      const fName = record.get('firstName')
      logger.info(`lastName was ${record.get('lastName')}`)
      record.set('lastName', fName)
      return record
    },
  }
)

// onChange ->
// Rich Type (boolean): raw value => type casting => logic hook => internal validation (AJV/bla bla bla)
// Vanilla Type: raw value => hook
// New: raw value => type cast only (custom hook) => super hook => type cast & validate => logic hook => validation hook

const OtherContact = new Sheet(
  'OtherContact',
  {
    firstName: TextField('First Name', {
      required: true,
      description: 'foo',
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
    onChange(record, session, logger) {
      const fName = record.get('firstName')
      logger.info(`lastName was ${record.get('lastName')}`)
      record.set('lastName', fName)
      return record
    },
  }
)

const ContactOnboardingWorkbook = new Workbook({
  name: 'Contact Onboarding',
  namespace: 'onboarding-1',
  models: {
    Contact,
    OtherContact,
  },
})

export default ContactOnboardingWorkbook

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

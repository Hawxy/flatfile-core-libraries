import {
  BooleanField,
  CategoryField,
  EmailField,
  TextField,
  Sheet,
  Workbook,
} from '@flatfile/configure'

const NewTemplateFromSDK = new Sheet(
  'NewTemplateFromSDK',
  {
    firstName: TextField('First', {
      required: true,
      description: 'foo',
    }),
    lastName: TextField('Last'),
    email: EmailField('E-mail', {
      nonPublic: true,
      compute: (v) => v.toUpperCase(),
    }),
    boolean: BooleanField(),
    selectOptions: CategoryField('Lots of options', {
      categories: {
        red: 'Red Thing',
        blue: 'Blue Label',
        green: 'Green is the best',
      },
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
  name: 'Category And Boolean Onboarding',
  namespace: 'onboarding',
  sheets: {
    NewTemplateFromSDK,
  },
})

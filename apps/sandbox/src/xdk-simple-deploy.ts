import {
  Sheet,
  Workbook,
  TextField,
  Message,
  SpaceConfig,
  ReferenceField,
} from '@flatfile/configure'

const TestSheet = new Sheet(
  'TestSheet',
  {
    firstName: TextField({
      label: 'First Name',
      description: "This is a human's first name",
    }),
    middleName: TextField('Middle'),
    lastName: TextField({
      label: 'Last Name',
      compute: (val: string): string => {
        if (val == 'bar') {
          return 'baz'
        }
        return val
      },
      validate: (val: string): void | Message[] => {
        if (val === 'Rock') {
          throw 'Rock is not allowed!!!'
        }
      },
    }),
  },
  {
    previewFieldKey: 'middleName',
    recordCompute: (record) => {
      const firstName = String(record.get('firstName'))
      if (firstName) {
        if (firstName && firstName.includes(' ')) {
          const components = firstName.split(' ')
          if (components.length > 1 && components[1] !== '') {
            record.set('firstName', components[0])
            record.set('lastName', components[1])

            record
              .addInfo('firstName', 'Full name was split')
              .addInfo('lastName', 'Full name was split')
          }
        }
      }
    },
  }
)

const SheetWithLink = new Sheet(
  'SheetWithLink',
  {
    nickname: TextField(),
    lastName: ReferenceField({
      label: 'Last Name',
      sheetKey: 'TestSheet',
      foreignKey: 'lastName',
      relationship: 'has-many',
    }),
  },
  {
    recordCompute: (record) => {
      const links = record.getLinks('lastName')
      const middleName = links[0].middleName
      if (!!middleName) {
        record.set('nickname', middleName)
      }
      record.set('lastName', 'Joey')
    },
  }
)

const Workbook1 = new Workbook({
  name: 'Workbook 1',
  slug: 'xdk-test',
  namespace: 'xdk-test',
  sheets: {
    TestSheet,
    SheetWithLink,
  },
})

const SpaceConfig1 = new SpaceConfig({
  name: 'Space Config 1',
  slug: 'space-config-1',
  workbookConfigs: {
    Workbook1,
  },
})

export default SpaceConfig1

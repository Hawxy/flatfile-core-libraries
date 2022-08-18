import {
  OptionField,
  NumberField,
  Message,
  LinkedField,
  TextField,
} from './Field'
import { Sheet } from './Sheet'

describe('NumberField tests ->', () => {
  test('toSchemaIL works', () => {
    expect(NumberField({}).toSchemaILField('a_number_field')).toMatchObject({
      description: '',
      field: 'a_number_field',
      label: 'a_number_field',
      primary: false,
      required: false,
      type: 'number',
      unique: false,
    })
    expect(
      NumberField({ required: true }).toSchemaILField('a_number_field')
    ).toMatchObject({
      description: '',
      field: 'a_number_field',
      label: 'a_number_field',
      primary: false,
      required: true,
      type: 'number',
      unique: false,
    })
  })
  test('computeToValue works', () => {
    const nf = NumberField({
      cast: (val: any) => {
        return parseInt(val)
      },
    })
    expect(nf.computeToValue('10')).toStrictEqual([10, null])

    expect(nf.computeToValue(undefined)).toStrictEqual([NaN, null])
    const nf2 = NumberField({
      cast: (val: any) => {
        throw new Error('err')
      },
    })
    const m = new Message('Error: err', 'error', 'cast')
    expect(nf2.computeToValue(undefined)).toStrictEqual([undefined, m])
  })
})

describe('OptionField tests ->', () => {
  test('toSchemaIL works', () => {
    expect(
      OptionField({
        label: 'Custom Label',
        options: { foo: 'Foo', bar: 'Display label for bar' },
      }).toSchemaILField('option_field')
    ).toMatchObject({
      description: '',
      field: 'option_field',
      label: 'Custom Label',
      primary: false,
      required: false,
      labelEnum: { foo: 'Foo', bar: 'Display label for bar' },
      type: 'enum',
      unique: false,
    })
  })
})

describe('LinkedField tests ->', () => {
  test('toSchemaIL works', () => {
    const BaseTemplate = new Sheet(
      'BaseTemplate',
      {
        firstName: TextField({
          unique: true,
          primary: true,
        }),
        middleName: TextField('Middle'),
        lastName: TextField(),
      },
      {
        previewFieldKey: 'middleName',
      }
    )

    expect(
      LinkedField({
        label: 'Custom Label',
        sheet: BaseTemplate,
      }).toSchemaILField('linked_field')
    ).toMatchObject({
      description: '',
      field: 'linked_field',
      label: 'Custom Label',
      primary: false,
      required: false,
      type: 'schema_ref',
      sheetName: 'BaseTemplate',
      unique: false,
    })
  })
})

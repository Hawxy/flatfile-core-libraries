import { NumberField } from '@flatfile/configure'
import { WorkbookTester } from './WorkbookTester'

/*
  This test file is supposed to look like a traditional jest test, it is used for developers of the SchemaIL, FlatfileDDL, and Hook runtimes.

  More compact demonstrative tests live in other files

  */

const BaseFieldArgs = {
  required: true,
  description: 'This is a Number Field',
}

// First sets of Workbook Tests
describe('Unique tests ->', () => {
  test('Sending non unique rwos throws an Error', async () => {
    const rawData = { firstNumber: { a: 'asdf' } }

    const TestSchema = new WorkbookTester(
      {
        a: NumberField({...BaseFieldArgs, unique:true}),
        b: NumberField({...BaseFieldArgs, required:true}),
      },
      {}
    )
    // this should throw some type of error
    await TestSchema.checkRows([{a:1,b:2}, {a:1, b:3}])
  })
})

// First sets of Workbook Tests
describe('Field Hook ->', () => {
  describe('cast()', () => {
    test('correctly casts object to default number', async () => {
      const rawData = { firstNumber: { a: 'asdf' } }
      const expectedOutput = { firstNumber: 0 }

      const TestSchema = new WorkbookTester(
        {
          firstNumber: NumberField({
            ...BaseFieldArgs,
            cast: (v) => {
              if (isNaN(Number(v))) {
                return 0
              }

              return Number(v)
            },
          }),
        },
        {}
      )

      await TestSchema.checkRowResult({ rawData, expectedOutput })
    })
  })
  describe('empty()', () => {
    test('correctly casts null to default number', async () => {
      const rawData = { firstNumber: null }
      const expectedOutput = { firstNumber: 0 }

      const TestSchema = new WorkbookTester(
        {
          firstNumber: NumberField({ ...BaseFieldArgs, empty: () => 0 }),
        },
        {}
      )

      await TestSchema.checkRowResult({ rawData, expectedOutput })
    })
  })

  describe('compute()', () => {
    test('correctly change value', async () => {
      const rawData = { firstNumber: 100 }
      const expectedOutput = { firstNumber: 102 }
      const TestSchema = new WorkbookTester(
        {
          firstNumber: NumberField({
            ...BaseFieldArgs,
            compute: (v) => v + 2,
          }),
        },
        {}
      )
      await TestSchema.checkRowResult({ rawData, expectedOutput })
    })
  })

  describe('validate()', () => {
    test('correctly throw error message and apply to field', async () => {
      const rawData = { firstNumber: 101 }
      const message = 'too big'
      const TestSchema = new WorkbookTester(
        {
          firstNumber: NumberField({
            ...BaseFieldArgs,
            validate: (v) => {
              if (v > 100) {
                throw message
              }
            },
          }),
        },
        {}
      )

      await TestSchema.checkRowMessage({ rawData, message })
    })
  })
})

describe('Record Hook ->', () => {
  describe('onChange()', () => {
    test('onChange expected output is correct', async () => {
      const rawData = { firstNumber: 50 }
      const expectedOutput = { firstNumber: 100 }
      const TestSchema = new WorkbookTester(
        {
          firstNumber: NumberField({
            ...BaseFieldArgs,
          }),
        },
        {
          onChange: (record: any) => {
            const firstNumber = record.get('firstNumber')
            record.set('firstNumber', firstNumber * 2)
          },
        }
      )

      await TestSchema.checkRowResult({ rawData, expectedOutput })
    })

    test('cast() + compute() + validate() + onChange() expected output is correct', async () => {
      const rawData = { firstNumber: "99" }
      const expectedOutput = { firstNumber: 202 }
      const TestSchema = new WorkbookTester(
        {
          firstNumber: NumberField({
            ...BaseFieldArgs,
            cast: (v) => {
              if (isNaN(Number(v))) {
                return 0
              }

              return Number(v)
            },
            compute: (v) => v + 2,
            validate: (v) => {
              if (v > 100) {
                throw 'too big'
              }
            },
          }),
        },
        {
          onChange: (record: any) => {
            const firstNumber = record.get('firstNumber')
            record.set('firstNumber', firstNumber * 2)
          },
        }
      )

      await TestSchema.checkRowResult({ rawData, expectedOutput, message: 'too big' })
    })
  })
})

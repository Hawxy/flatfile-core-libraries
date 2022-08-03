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
  test('Sending rows with duplicates in multiple columns returns duplicates location', async () => {
    const TestSchema = new WorkbookTester(
      {
        a: NumberField({ ...BaseFieldArgs, unique: true }),
        b: NumberField({ ...BaseFieldArgs, unique: true, required: true }),
        c: NumberField({
          ...BaseFieldArgs,
          unique: true,
          validate: (v) => {
            if (v > 100) {
              throw 'too big'
            }
          },
        }),
      },
      {}
    )

    const dataWithDuplicates = [
      { a: 1, b: null, c: 100 },
      { a: 1, b: 3, c: 100 },
      { a: '', b: undefined, c: 100 },
      { a: 2, b: '', c: 100 },
      { a: 1, b: 3, c: 300 },
    ]

    const expectedDuplicates = { a: [1, 2, 5], b: [2, 5], c: [1, 2, 3, 4] }

    expect(
      await TestSchema.checkForDuplicates(dataWithDuplicates)
    ).toStrictEqual(expectedDuplicates)
  })

  test('Sending data without duplicates returns null', async () => {
    const TestSchema = new WorkbookTester(
      {
        a: NumberField({ ...BaseFieldArgs, unique: true }),
        b: NumberField({ ...BaseFieldArgs, required: true }),
        c: NumberField({
          ...BaseFieldArgs,
          validate: (v) => {
            if (v > 100) {
              throw 'too big'
            }
          },
        }),
      },
      {}
    )

    const dataWithDuplicates = [
      { a: 1, b: null, c: 100 },
      { a: 2, b: 3, c: 100 },
      { a: '', b: undefined, c: 100 },
      { a: 4, b: '', c: 100 },
      { a: 5, b: 3, c: 300 },
    ]

    const expectedDuplicates = null

    expect(await TestSchema.checkForDuplicates(dataWithDuplicates)).toBe(
      expectedDuplicates
    )
  })
})

describe('Required tests ->', () => {
  test('Sending data without required fields returns location of missing fields', async () => {
    const TestSchema = new WorkbookTester(
      {
        a: NumberField({ ...BaseFieldArgs, unique: true }),
        b: NumberField({ ...BaseFieldArgs, required: true }),
        c: NumberField({
          ...BaseFieldArgs,
          validate: (v) => {
            if (v > 100) {
              throw 'too big'
            }
          },
        }),
      },
      {}
    )

    const dataWithMissingFields = [
      { a: 1, b: null, c: 100 },
      { a: 2, b: 3, c: 100 },
      { a: '', b: undefined, c: 100 },
      { a: 4, b: '', c: 100 },
      { a: 5, b: 3, c: 300 },
    ]

    const expectedMissingFields = {
      a: [3],
      b: [1, 3, 4],
    }

    expect(
      await TestSchema.checkForMissingFields(dataWithMissingFields)
    ).toStrictEqual(expectedMissingFields)
  })

  test('Sending data with required fields returns null', async () => {
    const TestSchema = new WorkbookTester(
      {
        a: NumberField({ ...BaseFieldArgs, unique: true }),
        b: NumberField({ ...BaseFieldArgs, required: true }),
        c: NumberField({
          ...BaseFieldArgs,
          validate: (v) => {
            if (v > 100) {
              throw 'too big'
            }
          },
        }),
      },
      {}
    )

    const dataWithMissingFields = [
      { a: 1, b: 2, c: 100 },
      { a: 2, b: 2, c: 100 },
      { a: 3, b: 6, c: 100 },
      { a: 4, b: 7, c: 100 },
      { a: 5, b: 3, c: 300 },
    ]

    const expectedMissingFields = null

    expect(await TestSchema.checkForMissingFields(dataWithMissingFields)).toBe(
      expectedMissingFields
    )
  })
})

describe('Unique, Required, Values and Messages tests ->', () => {
  test('Check that result matches expected output with validation and messages', async () => {
    const TestSchema = new WorkbookTester(
      {
        a: NumberField({ ...BaseFieldArgs, unique: true }),
        b: NumberField({
          ...BaseFieldArgs,
          cast: (v) => {
            if (isNaN(Number(v))) {
              return 0
            }
            return Number(v)
          },
          compute: (v) => v * 2,
          required: true,
        }),
        c: NumberField({
          ...BaseFieldArgs,
          validate: (v) => {
            if (v > 100) {
              throw 'too big'
            }
          },
        }),
      },
      {}
    )

    const data = [
      { a: 1, b: null, c: 100 },
      { a: 1, b: 3, c: 100 },
      { a: '', b: undefined, c: 100 },
      { a: 2, b: '', c: 100 },
      { a: 1, b: 3, c: 300 },
    ]

    const expectedOutput = [
      { a: 1, b: 0, c: 100 },
      { a: 1, b: 6, c: 100 },
      { a: '', b: 0, c: 100 },
      { a: 2, b: 0, c: 100 },
      { a: 1, b: 6, c: 300 },
    ]

    const expectedDuplicates = { a: [1, 2, 5] }
    const expectedMissingFields = { a: [3] }

    await TestSchema.checkRows({
      data,
      expectedOutput,
      expectedDuplicates,
      expectedMissingFields,
    })
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
      const rawData = { firstNumber: '99' }
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

      await TestSchema.checkRowResult({
        rawData,
        expectedOutput,
        message: 'too big',
      })
    })
  })
})

import { FlatfileRecord } from '@flatfile/hooks'
import { DateField, NumberField } from './Field'
import { WorkbookTester } from './WorkbookTester'

describe('EgressFormatTests ->', () => {
  test('simple egress works ', async () => {
    const TestSchema = new WorkbookTester(
      { b: NumberField({ egressFormat: (val: number) => `${val}` }) },
      {}
    )

    await TestSchema.checkRowResult({
      rawData: { b: '20' },
      expectedOutput: { b: '20' },
    })
  })
  const ef20Improper = (val: number) => {
    if (val === 20) {
      return '30'
    }
    return `${val}`
  }
  test('improper egress at compute prevents change to record egress works ', async () => {
    const TestSchema = new WorkbookTester(
      { b: NumberField({ egressFormat: ef20Improper }) },
      {}
    )

    await TestSchema.checkRowResult({
      rawData: { b: '20' }, //egress format will try to return 30, but this will fail verifyEgressCycle, test that '20' is still saved
      expectedOutput: { b: '20' },
      message:
        "Error: field couldn't reify to same value after egressFormat. Value 20 of type number was egressFormatted to to string of '30' which couldn't be cast back to 20. Persisting this would result in data loss. The original value 20 was not changed.",
    })

    await TestSchema.checkRowResult({
      rawData: { b: '21' },
      expectedOutput: { b: '21' },
    })
  })

  test('improper egressFormat at recordCompute prevents change to record egress works ', async () => {
    const TestSchema = new WorkbookTester(
      { b: NumberField({ egressFormat: ef20Improper }) },
      {
        recordCompute: (rec: FlatfileRecord<any>) => {
          rec.set('b', (rec.get('b') as number) + 1)
        },
      }
    )

    await TestSchema.checkRowResult({
      rawData: { b: '19' }, // egress format will try to return 30, but this will fail verifyEgressCycle, test that '20' is still saved
      // ideally we would roll back the failed to egress recordCompute
      // or batchRecordsCompute modifications, but we have no
      // mechanism for that
      expectedOutput: { b: 20 },
      message:
        "Error: sheet tried to egressFormat value 20 of type number to string of '30' which couldn't be cast back to 20. Persisting this would result in data loss. The original value 20 was not changed.",
    })

    await TestSchema.checkRowResult({
      rawData: { b: '21' },
      expectedOutput: { b: '22' },
    })
  })

  const ef20Error = (val: number) => {
    if (val === 20) {
      throw new Error('egress failure')
    }
    return `${val}`
  }
  test('error egress at compute prevents change to record egress works ', async () => {
    const TestSchema = new WorkbookTester(
      { b: NumberField({ egressFormat: ef20Error }) },
      {}
    )

    await TestSchema.checkRowResult({
      // egress format will try to return 30, but this will fail verifyEgressCycle, test that '20' is still saved
      rawData: { b: '20' },
      expectedOutput: { b: '20' },
      message:
        'Error: field threw an error at egressFormat with a value of 20 of type number',
    })

    await TestSchema.checkRowResult({
      rawData: { b: '21' },
      expectedOutput: { b: '21' },
    })
  })
  test('improper egressFormat at recordCompute prevents change to record egress works ', async () => {
    const TestSchema = new WorkbookTester(
      {
        b: NumberField({
          egressFormat: ef20Error,
        }),
      },
      {
        recordCompute: (rec: FlatfileRecord<any>) => {
          rec.set('b', (rec.get('b') as number) + 1)
        },
      }
    )

    await TestSchema.checkRowResult({
      rawData: { b: '19' }, //egress format will try to return 30, but this will fail verifyEgressCycle, test that '20' is stills aved
      // ideally we would roll back the failed to egress recordCompute
      // or batchRecordsCompute modifications, but we have no
      // mechanism for that
      expectedOutput: { b: 20 },
      message:
        'Error: sheet threw an error when trying to egressFormat a value of 20 of type number',
    })

    await TestSchema.checkRowResult({
      rawData: { b: '21' },
      expectedOutput: { b: '22' },
    })
  })

  test('verify that dates can egress  ', async () => {
    const TestSchema = new WorkbookTester(
      { b: DateField({ egressFormat: (val: Date) => `${val}` }) },
      {}
    )

    //expectedEgress will look something like "Sat Sep 19 2009 20:00:00 GMT-0400 (Eastern Daylight Time)" note the included timezone, this egress will be different when run in different timezones, so we need to fix it here... This stuff is why dates and egress need to be thought of carefully
    const expectedEgress = `${new Date('2009-09-20')}`
    await TestSchema.checkRowResult({
      rawData: { b: '2009-09-20' },
      expectedOutput: { b: expectedEgress },
    })
  })

  test('verify that dates can egress test 2', async () => {
    const TestSchema = new WorkbookTester(
      {
        b: DateField({
          egressFormat: (val: Date) =>
            `${val.getUTCFullYear()}-${
              val.getUTCMonth() + 1
            }-${val.getUTCDate()}`,
        }),
      },
      {}
    )

    await TestSchema.checkRowResult({
      rawData: { b: '2009-10-20' },
      expectedOutput: { b: '2009-10-20' },
      message: false,
    })
  })
})

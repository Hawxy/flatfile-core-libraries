import { FlatfileRecord } from './FlatfileRecord'
import { FlatfileRecords } from './FlatfileRecords'

const rawRecords = [
  {
    rawData: { name: 'Dog', age: 12 },
    rowId: 0,
    info: [],
  },
  {
    rawData: { name: 'Cat', age: 24 },
    rowId: 1,
    info: [],
  },
]

describe('FlatfileRecords', () => {
  it('should transform raw records to records', () => {
    const people = new FlatfileRecords(rawRecords)
    const peopleToRecords = rawRecords.map(
      (rawRecord) => new FlatfileRecord(rawRecord)
    )

    expect(people.records).toEqual(peopleToRecords)
  })

  it('should transform records to json', () => {
    const people = new FlatfileRecords(rawRecords)
    // manually generate set of records
    const peopleToRecords = rawRecords.map(
      (rawRecord) => new FlatfileRecord(rawRecord)
    )
    // manually generate set of json records
    const peopleToJson = peopleToRecords.map((record) => record.toJSON())

    expect(people.toJSON()).toEqual(peopleToJson)
  })
})

import { mock, restore, Stub } from 'simple-mock'

import { FlatfileRecord, IRawRecord } from './FlatfileRecord'

describe('FlatfileRecord', () => {
  let person: FlatfileRecord
  let log: Stub<boolean>
  let rawRecord: IRawRecord

  beforeEach(() => {
    rawRecord = {
      rawData: { name: 'Jared', age: 12, favePet: null },
      rowId: 1,
    }
    person = new FlatfileRecord(rawRecord)
    log = mock(console, 'error', () => true)
  })

  it('returns a rowId for a given record', () => {
    expect(person.rowId).toEqual(rawRecord.rowId)
  })

  it('returns a value for a field that exists', () => {
    expect(person.get('age')).toEqual(rawRecord.rawData.age)
  })

  it('returns null value for a field that does not exist', () => {
    expect(person.get('job')).toBeNull()
  })

  it('getter logs an error when no property', () => {
    person.get('job')
    expect(log.callCount).toBe(1)
  })

  it('returns an updated record if a records value is changed but retain its original value', () => {
    const growUp = (rawRecord.rawData.age as number) + 1

    person.set('age', growUp)

    expect(person.value.age).toEqual(growUp)
    expect(person.originalValue.age).toEqual(rawRecord.rawData.age)
  })

  it('adds messages with varying levels of severity to fields', () => {
    person.addInfo('name', 'Rad name')
    person.addComment('age', 'What a name')
    person.addError('age', 'So immature')
    person.addWarning(['name', 'age'], 'Name too rad, age too immature')

    const res = person.toJSON()
    const info = res.info.find((message) => message.level === 'info')
    const comment = res.info.find(
      (message) => message.level === 'info' && message.field === 'age'
    )
    const error = res.info.find((message) => message.level === 'error')
    const nameWarning = res.info.find(
      (message) => message.level === 'warn' && message.field === 'name'
    )
    const ageWarning = res.info.find(
      (message) => message.level === 'warn' && message.field === 'age'
    )

    expect(info).toEqual({
      field: 'name',
      message: 'Rad name',
      level: 'info',
      stage: 'other',
    })

    expect(comment).toEqual({
      field: 'age',
      message: 'What a name',
      level: 'info',
      stage: 'other',
    })

    expect(error).toEqual({
      field: 'age',
      message: 'So immature',
      level: 'error',
      stage: 'other',
    })

    expect(nameWarning).toEqual({
      field: 'name',
      message: 'Name too rad, age too immature',
      level: 'warn',
      stage: 'other',
    })

    expect(ageWarning).toEqual({
      field: 'age',
      message: 'Name too rad, age too immature',
      level: 'warn',
      stage: 'other',
    })
  })

  it('does not return an updated record if a record value that does not exist is changed', () => {
    person.set('job', 'engineer')

    expect(person.value.job).toBeUndefined()
  })

  it('setter logs an error when no property', () => {
    person.set('job', 'engineer')
    expect(log.callCount).toBe(1)
  })

  it('should get and set linked values', () => {
    const record = new FlatfileRecord(rawRecord)

    expect(
      record.setLinkedValue('favePet', 'name', 'rover').value
    ).toHaveProperty('favePet::name')
    expect(record.getLinkedValue('favePet', 'name')).toBe('rover')
  })

  afterEach(() => {
    restore()
  })
})

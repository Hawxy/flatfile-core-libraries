import { getRegexFlags } from './regex.flags'

describe('getRegexFlags', () => {
  it('works when no source is set', () => {
    const result = getRegexFlags()
    expect(result).toBe('')
  })

  it('works with an empty source object', () => {
    const result = getRegexFlags({})
    expect(result).toBe('')
  })

  it('works with all flags set to false', () => {
    const result = getRegexFlags({
      dotAll: false,
      ignoreCase: false,
      global: false,
      multiline: false,
      unicode: false
    })
    expect(result).toBe('')
  })

  it('works with all flags set to true', () => {
    const result = getRegexFlags({
      dotAll: true,
      ignoreCase: true,
      multiline: true,
      unicode: true,
      global: true
    })
    expect(result).toBe('simgu')
  })

  it('works with dotAll flag set to true', () => {
    const result = getRegexFlags({ dotAll: true })
    expect(result).toBe('s')
  })

  it('works with ignoreCase flag set to true', () => {
    const result = getRegexFlags({ ignoreCase: true })
    expect(result).toBe('i')
  })

  it('works with global flag set to true', () => {
    const result = getRegexFlags({ global: true })
    expect(result).toBe('g')
  })

  it('works with multiline flag set to true', () => {
    const result = getRegexFlags({ multiline: true })
    expect(result).toBe('m')
  })

  it('works with unicode flag set to true', () => {
    const result = getRegexFlags({ unicode: true })
    expect(result).toBe('u')
  })
})

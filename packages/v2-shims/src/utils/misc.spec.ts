import { isEmpty } from './misc'

describe('misc', () => {
  describe('isEmpty', () => {
    it('should detect empty values correctly', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty(true)).toBe(false)
      expect(isEmpty(false)).toBe(false)
      expect(isEmpty('test')).toBe(false)
      expect(isEmpty(12)).toBe(false)
    })
  })
})

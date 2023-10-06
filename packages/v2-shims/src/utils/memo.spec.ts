import { memo } from './memo'

describe('memo', () => {
  it('should cache values properly', () => {
    const spy = jest.fn((t) => t)

    const f = memo(spy)
    const obj = { t: 1 }

    expect(spy).not.toBeCalled()

    f(obj)

    expect(spy).toBeCalledTimes(1)

    // called 10 more times
    Array.from(new Array(10)).forEach(() => f(obj))

    expect(spy).toBeCalledTimes(1)

    f({ t: 2 })

    expect(spy).toBeCalledTimes(2)
  })
})

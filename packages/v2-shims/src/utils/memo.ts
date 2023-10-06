export const memo = <T extends object, U>(func: (input: T) => U): ((input: T) => U) => {
  const cache = new WeakMap<T, U>()

  return (input: T) => {
    if (!cache.has(input)) {
      const result = func(input)
      cache.set(input, result)

      return result
    }

    return cache.get(input) as U
  }
}

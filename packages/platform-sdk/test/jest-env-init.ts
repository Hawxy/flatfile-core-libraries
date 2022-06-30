
type FunctionDescriptor<T> = [T, string & jest.FunctionPropertyNames<T>]

const LAMBDAS: ((...args: any[]) => any)[] = []

function pushLambdas(initialArgs: any[]) {
  const toSearch: any[][] = [initialArgs]
  let args: any[] | undefined
  while ((args = toSearch.pop())) {
    for (const arg of args) {
      if (typeof arg === 'function') {
        LAMBDAS.push(arg)
      } else if (typeof arg === 'object' && arg !== null) {
        toSearch.push(Object.values(arg))
      }
    }
  }
  return initialArgs
}

/*
test('anonymous type functions in decorators return as expected', () => {
  for (const f of LAMBDAS) {
    try {
      let type = f(null)
      while (Array.isArray(type)) {
        type = f[0]
      }
      expect(type).toBeDefined()
    } catch {
      // Not a type function, ignore
    }
  }
})
*/

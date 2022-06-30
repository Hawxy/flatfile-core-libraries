
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
export {};

import { serializeFn } from 'transferable-function'

export function serializeHook(fn: (payload: any, session: any) => void): string {
  return JSON.stringify(serializeFn(fn))
}

export function serializeFunction(fn: (...args: any[]) => any): string {
  return JSON.stringify(serializeFn(fn))
}

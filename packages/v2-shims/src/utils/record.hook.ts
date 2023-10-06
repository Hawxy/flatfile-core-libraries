import { FlatfileRecord } from '@flatfile/hooks'
import { FlatfileEvent } from '@flatfile/listener'
import { recordHook } from '@flatfile/plugin-record-hook'

export type MaybePromise<T> = T | Promise<T>

export function xRecordHookWrapper(
  sheetSlug: string,
  v2RecordHook: (
    record: Record<string, any>,
    event?: FlatfileEvent
  ) => MaybePromise<Record<string, any>>,
  options?: {
    concurrency?: number
    debug?: boolean
  }
) {
  return recordHook(
    sheetSlug,
    async (r: FlatfileRecord, e?: FlatfileEvent): Promise<FlatfileRecord> => {
      return await recordHookShim(r, v2RecordHook, e)
    },
    options
  )
}

export async function recordHookShim(
  r: FlatfileRecord,
  v2RecordHook: (
    record: Record<string, any>,
    e?: FlatfileEvent
  ) => MaybePromise<Record<string, any>>,
  e?: FlatfileEvent
) {
  const v2RecordHookResults = await v2RecordHook(r.originalValue, e)

  Object.keys(v2RecordHookResults).forEach((k) => {
    const value =
      typeof v2RecordHookResults[k] === 'string'
        ? v2RecordHookResults[k]
        : v2RecordHookResults[k]?.value
    r.set(k, value ?? null)

    const info = v2RecordHookResults[k]?.info
    if (info) {
      info.forEach((i: Record<string, any>) => {
        if (i.level === 'error') r.addError(k, i.message)
        if (i.level === 'warning') r.addWarning(k, i.message)
        if (i.level === 'info') r.addInfo(k, i.message)
      })
    }
  })

  return r
}

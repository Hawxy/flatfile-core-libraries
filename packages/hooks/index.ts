// import { TRecordData } from './types/Record'
//
// export interface FlatfileHook<M extends IModel> {
//   (props: HookProps<Record<keyof M['fields'], string>>): void
// }
//
// interface HookProps<M extends TRecordData> {
//   recordBatch: FlatfileRecords<M>
//   session: FlatfileSession
//   logger: any
// }

export * from './src/classes/FlatfileRecord'
export * from './src/classes/FlatfileRecords'
export * from './src/classes/FlatfileSession'

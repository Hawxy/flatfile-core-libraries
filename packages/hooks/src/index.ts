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

export {
  type IRawRecordWithInfo,
  type IRawRecord,
  type IRecordInfo,
  type TPrimitive,
  type TRecordData,
  type TRecordInfoLevel,
} from './types/Record'
export { type IPayload } from './types/IPayload'
export * from './classes/FlatfileRecord'
export * from './classes/FlatfileRecords'
export * from './classes/FlatfileSession'

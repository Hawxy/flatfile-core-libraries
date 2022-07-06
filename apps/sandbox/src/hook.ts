import example from '../src/setup'
import { FlatfileRecords, FlatfileSession } from '@flatfile/hooks'

export default async ({
  recordBatch,
  session,
  logger,
}: {
  recordBatch: FlatfileRecords<any>
  session: FlatfileSession
  logger: any
}) => {
  await example.runHookOnLambda({ recordBatch, session, logger })
}

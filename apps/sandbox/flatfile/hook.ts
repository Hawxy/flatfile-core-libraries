import example from './setup'
import { FlatfileRecords, FlatfileSession } from '@flatfile/hooks'

module.exports = async ({
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

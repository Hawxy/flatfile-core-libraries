import { FlatfileListener } from '@flatfile/listener'

import { Validator } from '../validator'
import { xRecordHookWrapper } from '../utils'
import { getSheetConfigFromSession } from '../utils/get.sheet.config.from.session'

export const v2Validators = (sheetSlug: string) => {
  return (listener: FlatfileListener) => {
    listener.use(
      xRecordHookWrapper(sheetSlug, async (record, event) => {
        const { sheetId } = event?.context
        const sheetSessionKey = `sheetConfig-${sheetId}`
        const sheetConfig = await getSheetConfigFromSession(sheetSessionKey)
        const validator = new Validator(sheetConfig)

        validator.validateRow(record)
        return record
      })
    )
  }
}

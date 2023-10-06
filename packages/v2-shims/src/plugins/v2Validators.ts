import { FlatfileListener } from '@flatfile/listener'
import api from '@flatfile/api'

import { Validator } from '../validator'
import { xRecordHookWrapper } from '../utils'

export const v2Validators = (sheetSlug: string) => {
  return (listener: FlatfileListener) => {
    listener.use(
      xRecordHookWrapper(sheetSlug, async (record, event) => {
        const { sheetId } = event?.context
        const {
          data: { config },
        } = await api.sheets.get(sheetId)
        const validator = new Validator(config)

        validator.validateRow(record)
        return record
      })
    )
  }
}

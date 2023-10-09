import api, { Flatfile } from '@flatfile/api'

export const getSheetConfigFromSession = async (
  sheetId: string
): Promise<Flatfile.SheetConfig> => {
  try {
    const sheetConfig = sessionStorage.getItem(sheetId)
    if (sheetConfig) {
      return sheetConfig
    } else {
      const {
        data: { config },
      } = await api.sheets.get(sheetId)
      sessionStorage.setItem(sheetId, config)
      return config
    }
  } catch (e) {
    const {
      data: { config },
    } = await api.sheets.get(sheetId)
    return config
  }
}

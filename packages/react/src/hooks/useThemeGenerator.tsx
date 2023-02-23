import tinycolor from 'tinycolor2'
import { IThemeConfig } from '../types/IThemeConfig'
import {
  BaseCustomTheme,
  BaseCustomTableThemeProps,
} from '../types/CustomTheme'

/**
 * @name useThemeGenerator
 * @description Hook to generate theme config to be passed to a workbook component
 *
 * @param { IThemeGenerator } { primary, action }
 * @returns { IThemeConfig }
 */

interface IThemeGenerator {
  primary: string
  action?: string
}

const baseThemeConfig = {
  root: {
    primaryColor: '',
  },
  sidebar: {
    backgroundColor: '',
    textColor: '',
    titleColor: '',
  },
  table: { ...BaseCustomTheme },
}

const updatePrimaryColorValues = ({
  color,
  themeObj,
}: {
  color: string
  themeObj: Partial<BaseCustomTableThemeProps>
}): Partial<BaseCustomTableThemeProps> => {
  const themeObjCopy = themeObj
  const { indexColumn, inputs, cell, loading, boolean, column } = themeObjCopy

  if (indexColumn && indexColumn.selected) {
    indexColumn.backgroundColor = color
    indexColumn.selected.color = color
    indexColumn.selected.backgroundColor = tinycolor(color)
      .lighten(70)
      .toHexString()
  }

  if (column && column.header) {
    column.header.backgroundColor = color
  }

  if (inputs && inputs.radio) {
    inputs.radio.color = color
  }
  if (cell && cell.selected) {
    cell.selected.backgroundColor = tinycolor(color).lighten(70).toHexString()
  }

  if (loading) {
    loading.color = color
  }
  if (boolean) {
    boolean.toggleChecked = color
  }

  return themeObjCopy
}

const updateActionColorValues = ({
  color,
  themeObj,
}: {
  color: string
  themeObj: Partial<BaseCustomTableThemeProps>
}): Partial<BaseCustomTableThemeProps> => {
  let themeObjCopy = themeObj
  const { inputs, cell, column, filters } = themeObjCopy

  if (inputs && inputs.checkbox) {
    inputs.checkbox.color = color
  }

  if (cell && cell.active) {
    cell.active.borderColor = color
    cell.active.spinnerColor = color
  }

  if (column && column.header && column.header.dragHandle) {
    column.header.dragHandle.idle = color
    column.header.dragHandle.dragging
  }

  if (filters && filters.active) {
    filters.active.backgroundColor = color
  }

  return themeObjCopy
}

export const useThemeGenerator = ({
  primary,
  action,
}: IThemeGenerator): IThemeConfig => {
  // copy base theme to local var
  let baseTheme = baseThemeConfig

  // validate primary color
  if (!tinycolor(primary).isValid()) {
    throw new Error('invalid primary color passed')
  }

  // validate action color if passed
  if (!!action && !tinycolor(action).isValid()) {
    throw new Error('invalid action color passed')
  }

  // set table values
  // set primary colors on table
  const baseThemeWithPrimaryTableColors = updatePrimaryColorValues({
    color: primary,
    themeObj: baseTheme.table,
  })

  const lightPrimary = tinycolor(primary).lighten(30).toHexString()

  if (!action) {
    return {
      root: { primaryColor: primary },
      sidebar: {
        backgroundColor: primary,
        titleColor: lightPrimary,
        textColor: lightPrimary,
      },
      table: baseThemeWithPrimaryTableColors,
    }
  }

  // set action colors on table

  const baseThemeWithAllColors = updateActionColorValues({
    color: action,
    themeObj: baseThemeWithPrimaryTableColors,
  })

  return {
    root: { primaryColor: primary },
    sidebar: {
      backgroundColor: primary,
      titleColor: lightPrimary,
      textColor: lightPrimary,
    },
    table: baseThemeWithAllColors,
  }
}

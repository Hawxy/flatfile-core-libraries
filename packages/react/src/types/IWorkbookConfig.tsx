import { ISidebarConfig } from './ISidebarConfig'
import { IThemeConfig } from './IThemeConfig'
import { Action } from '@flatfile/configure'

export interface IWorkbookConfig {
  /**
   * Access token
   */
  token: string
  /**
   * Identifier for space
   * If spaceId is provided, launch space - else create new
   */
  spaceId?: string
  /**
   * Identifier for env - required
   */
  envId: string
  /**
   * Theme values for space, sidebar and data table
   */
  themeConfig?: IThemeConfig
  /**
   * Sidebar config values to toggle UI elements
   */
  sidebarConfig?: ISidebarConfig
  /**
   * Actions for space
   */
  actions?: Action[]
}

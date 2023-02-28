import { Blueprint } from '@flatfile/api'
import { ISidebarConfig } from './ISidebarConfig'
import { IThemeConfig } from './IThemeConfig'

export interface ISpaceConfig {
  /**
   * Access token accessed via /auth/access-token
   * Required
   */
  accessToken: string
  /**
   * Identifier for environment
   * Required
   */
  environmentId: string
  /**
   * Identifier for space
   * Optional
   */
  spaceId?: string
  /**
   * Shape of data you will be receiving:
   * Required if no spaceId
   */
  spaceConfig?:
    | {
        slug: string
        name: string
        blueprints: Blueprint[]
      }
    | any
  /**
   * Theme values for space, sidebar and data table
   * Optional
   */
  themeConfig?: IThemeConfig
  /**
   * Sidebar config values to toggle UI elements
   * Optional
   */
  sidebarConfig?: ISidebarConfig
}

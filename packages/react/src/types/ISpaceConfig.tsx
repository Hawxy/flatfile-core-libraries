import { Blueprint, DocumentConfig, Action } from '@flatfile/api'
import { XOR } from 'ts-xor'
import { ISidebarConfig } from './ISidebarConfig'
import { IThemeConfig } from './IThemeConfig'

export interface BaseSpaceConfig {
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
   * Theme values for space, sidebar and data table
   * Optional
   */
  themeConfig?: IThemeConfig
  /**
   * Sidebar config values to toggle UI elements
   * Optional
   */
  sidebarConfig?: ISidebarConfig
  /**
   * Document to pass to space
   * Optional
   */
  document?: DocumentConfig
  /**
   * Actions belonging to a Space
   * Optional
   */
  actions?: Action[]
}

interface SpaceWithSpaceId extends BaseSpaceConfig {
  /**
   * Identifier for space
   * Required if no config or configId
   */
  spaceId: string
}

interface SpaceWithSpaceConfigId extends BaseSpaceConfig {
  /**
   * Identifier for space
   * Optional
   */
  spaceId?: string
  /**
   * Id of shape of data you will be receiving:
   * Required if no spaceId
   */
  spaceConfigId: string
}

interface SpaceWithRawSpaceConfig extends BaseSpaceConfig {
  /**
   * Identifier for space
   * Optional
   */
  spaceId?: string
  /**
   * Shape of data you will be receiving:
   * Required if no spaceId
   */
  spaceConfig:
    | {
        slug: string
        name: string
        blueprints: Blueprint[]
      }
    | any
}

export type ISpaceConfig = XOR<
  XOR<SpaceWithSpaceId, SpaceWithSpaceConfigId>,
  XOR<SpaceWithSpaceConfigId, SpaceWithRawSpaceConfig>
>

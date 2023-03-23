import { Blueprint, DocumentConfig, Action } from '@flatfile/api'
import { XOR } from 'ts-xor'
import { ISidebarConfig } from './ISidebarConfig'
import { IThemeConfig } from './IThemeConfig'

export interface BaseSpace {
  /**
   * Name of space
   * Optional
   */
  name?: string
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
   * Additional metadata to be passed to the space
   * Optional
   */
  spaceInfo?: Partial<ISpaceInfo>
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

export interface ISpaceInfo {
  userId?: string
  name?: string
  companyId?: string
  companyName?: string
}

interface SpaceWithSpaceId extends BaseSpace {
  /**
   * Identifier for space
   * Required if no config or configId
   */
  spaceId: string
}

interface SpaceWithSpaceConfigId extends BaseSpace {
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

interface SpaceWithRawSpaceConfig extends BaseSpace {
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

export type ISpace = XOR<
  XOR<SpaceWithSpaceId, SpaceWithSpaceConfigId>,
  XOR<SpaceWithSpaceConfigId, SpaceWithRawSpaceConfig>
>

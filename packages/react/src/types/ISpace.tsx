import { Flatfile } from '@flatfile/api'
import { FlatfileListener } from '@flatfile/listener'
import React from 'react'
import { ISidebarConfig } from './ISidebarConfig'
import { IThemeConfig } from './IThemeConfig'

export interface ISpace {
  /**
   * Name of space
   * Optional
   */
  name?: string
  /**
   * Publishable key accessed via auth/api-keys or Flatfile dashboard > Developer
   * Required
   */
  publishableKey: string
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
  document?: Flatfile.DocumentConfig
  /**
   * Additional metadata to be passed to the space
   * Optional
   */
  spaceInfo?: Partial<ISpaceInfo>
  /**
   * Shape of data you will be receiving:
   * Required
   */
  workbook: Pick<Flatfile.CreateWorkbookConfig, 'name' | 'sheets' | 'actions'>
  /**
   * Listener for advanced functionality
   * Optional
   */
  listener?: FlatfileListener
  /**
   *
   * Style the iframe using CSS Properties
   * Optional
   */
  iframeStyles?: React.CSSProperties
  /**
   *
   * Operation to perform when the space is closed
   * Optional
   */
  closeSpace?: {
    operation: string
    onClose: (data: any) => void
  }
  /**
   *
   * Custom prompt to display when user tries to exit the space
   * Optional
   */
  exitText?: string
  /**
   *
   * Custom header to display when user tries to exit the space
   * Optional
   */
  exitTitle?: string
  /**
   * Error element to override default Error component
   * Optional
   */
  error?: (error: Error | string) => React.ReactElement
  /**
   * Loading element to override default Loading component
   * Optional
   */

  loading?: React.ReactElement
}
export interface ISpaceInfo {
  userId?: string
  name?: string
  companyId?: string
  companyName?: string
}

import { BaseCustomTableThemeProps } from './CustomTheme'

export interface ThemeConfig {
  /**
   * Global styles
   */
  root?: {
    [key: string]: string
  }
  /**
   * Sidebar styles
   */
  sidebar?: {
    [key: string]: string
  }
  /**
   * Data table styles
   */
  table?: Partial<BaseCustomTableThemeProps>
}

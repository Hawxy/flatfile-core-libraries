export interface IThemeConfig {
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
  table?: {
    [key: string]: {
      [key: string]: string
    }
  }
}

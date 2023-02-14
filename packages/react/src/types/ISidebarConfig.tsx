export interface ISidebarConfig {
  /**
   * Landing page upon loading a space
   * Defaults to primary workbook or first document, if there is one
   */
  defaultPage?: string
  /**
   * Toggle branding logo
   * Defaults to true
   */
  showPoweredByFlatfile?: boolean
  /**
   * Toggle ability to invite guests
   * Defaults to false
   */
  showGuestInvite?: boolean
  /**
   * Toggle data config for space
   * Defaults to false
   */
  showDataChecklist?: boolean
  /**
   * Toggle all files uploaded vs. only files uploaded by guest
   * Defaults to false
   */
  showFullFilesPage?: boolean
  /**
   * Toggle sidebar access
   * Defaults to false
   */
  showSidebar?: boolean
}

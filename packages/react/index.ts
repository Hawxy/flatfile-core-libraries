import Space from './src/components/Space'

import { makeTheme } from './src/utils/makeTheme'
import { useSpace } from './src/hooks/useSpace'
import type { ISpace, ISpaceInfo } from './src/types/ISpace'
import type { ISidebarConfig } from './src/types/ISidebarConfig'
import type { IThemeConfig } from './src/types/IThemeConfig'

export { makeTheme, useSpace, Space }

export type { ISpaceInfo, ISpace, ISidebarConfig, IThemeConfig }

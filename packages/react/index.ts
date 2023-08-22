import Space from './src/components/Space'

import { makeTheme } from './src/utils/makeTheme'
import { useSpace } from './src/hooks/useSpace'
import type { ISpace, IUserInfo, ISpaceInfo } from './src/types/ISpace'
import type { ISidebarConfig } from './src/types/ISidebarConfig'
import type { IThemeConfig } from './src/types/IThemeConfig'

export { makeTheme, useSpace, Space }

export type { IUserInfo, ISpaceInfo, ISpace, ISidebarConfig, IThemeConfig }

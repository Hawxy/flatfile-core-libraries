import Space from './src/components/Space'

import { makeTheme } from './src/utils/makeTheme'
import { useSpace } from './src/hooks/useSpace'
import type { ISpace, IUserInfo, ISpaceInfo, ISidebarConfig, IThemeConfig } from '@flatfile/embedded-utils'

export { makeTheme, useSpace, Space }

export type { IUserInfo, ISpaceInfo, ISpace, ISidebarConfig, IThemeConfig }

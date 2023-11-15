import Space from './src/components/Space'

import { makeTheme } from './src/utils/makeTheme'
import { useSpace } from './src/hooks/useSpace'
import { useSpaceTrigger } from './src/hooks/useSpaceTrigger'
import type { ISpace, IUserInfo, ISpaceInfo, ISidebarConfig, IThemeConfig } from '@flatfile/embedded-utils'

export { makeTheme, useSpace, useSpaceTrigger, Space }

export type { IUserInfo, ISpaceInfo, ISpace, ISidebarConfig, IThemeConfig }

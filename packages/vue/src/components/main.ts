import type { App } from '@vue/runtime-dom'
import { UseSpace } from './'

export default {
  install: (app: App) => {
    app.component('UseSpace', UseSpace)
  },
}

export { UseSpace }

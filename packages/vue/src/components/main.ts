import type { App } from '@vue/runtime-dom'
import { UseSpace, initializeFlatfile } from './'

export default {
  install: (app: App) => {
    app.component('UseSpace', UseSpace)
    app.component('initializeFlatfile', initializeFlatfile)
  },
}

export { UseSpace, initializeFlatfile }

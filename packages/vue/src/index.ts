import type { App } from 'vue'
import Spinner from './components/Spinner.vue'
import UseSpace from './components/UseSpace.vue'
import initializeFlatfile from './components/initializeFlatfile'

export default {
  install: (app: App) => {
    // eslint-disable-next-line vue/multi-word-component-names
    app.component('Spinner', Spinner)
    app.component('UseSpace', UseSpace)
  },
}

export { Spinner, UseSpace, initializeFlatfile }

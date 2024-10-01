import type { App } from 'vue'
import Spinner from './components/Spinner.vue'
import UseSpace from './components/UseSpace.vue'
import initializeFlatfile from './components/initializeFlatfile'
import './main.css'

export default {
  install: (app: App) => {
    app.component('Spinner', Spinner)
    app.component('UseSpace', UseSpace)
  },
}

export { Spinner, UseSpace, initializeFlatfile }

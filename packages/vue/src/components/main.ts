import type { App } from 'vue';
import { UseSpace } from "@/components";

export default {
  install: (app: App) => {
    app.component('UseSpace', UseSpace);
  },
};

export { UseSpace };
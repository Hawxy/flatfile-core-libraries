<template>
  <div class="main">
    <div class="description">
      <button @click="toggleSpace">{{ showSpace ? 'Close' : 'Open' }} space</button>
    </div>
    <div v-if="showSpace" class="space-wrapper">
      <UseSpace v-bind="spaceProps" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { UseSpace } from '@flatfile/vue';
import { config } from "./config";

const SPACE_ID = 'us_sp_1234';
const ENVIRONMENT_ID = 'us_env_1234';

export default {
  setup() {
    const showSpace = ref(false);
    const publishableKey = 'your_key';
    const environmentId = ENVIRONMENT_ID;
    const spaceProps = ref({
      name: 'Trste!',
      environmentId,
      publishableKey,
      closeSpace: {
        operation: 'contacts:submit',
        onClose: () => { showSpace.value = false; },
      },
      workbook: config,
      themeConfig: { primaryColor: "#546a76", textColor: "#fff" },
      userInfo: {
        name: 'my space name'
      },
      spaceInfo: {
        name: 'my space name'
      },
      displayAsModal: true,
      spaceBody: {
        metadata: {
          random: 'param'
        }
      }
    });

    const toggleSpace = () => {
      showSpace.value = !showSpace.value;
    };

    return {
      showSpace,
      toggleSpace,
      spaceProps,
    };
  },
  components: {
    UseSpace
  },
};
</script>
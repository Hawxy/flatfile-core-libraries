<template>
  <div>
    <DefaultError v-if="initError" :error="initError" />
    <SpaceC
      v-if="spaceUrl"
      :spaceUrl="spaceUrl"
      :displayAsModal="displayAsModal"
      :exitText="exitText"
      :exitTitle="exitTitle"
      :exitPrimaryButtonText="exitPrimaryButtonText"
      :exitSecondaryButtonText="exitSecondaryButtonText"
      :closeSpace="closeSpace"
      :iframeStyles="iframeStyles"
    />
    <SpinnerC v-else></SpinnerC>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import useInitializeSpace from '../utils/useInitializeSpace';
import getSpace from '../utils/getSpace';
import SpaceC from './SpaceC.vue';
import SpinnerC from './Spinner.vue';
import DefaultError from './DefaultError.vue';

export default {
  props: {
    name: String,
    publishableKey: String,
    environmentId: String,
    closeSpace: Object,
    space: Object,
    themeConfig: Object,
    sidebarConfig: Object,
    document: Object,
    spaceBody: Object,
    spaceInfo: Object,
    userInfo: Object,
    workbook: Object,
    displayAsModal: Boolean,
    iframeStyles: Object,
    mountElement: {
      type: String,
      default: 'flatfile_iFrameContainer',
    },
    exitText: {
      type: String,
      default: 'Are you sure you want to exit? Any unsaved changes will be lost.',
    },
    exitTitle: {
      type: String,
      default: 'Close Window',
    },
    exitPrimaryButtonText: {
      type: String,
      default: 'Yes, exit',
    },
    exitSecondaryButtonText: {
      type: String,
      default: 'No, stay',
    },
    apiUrl: {
      type: String,
      default: 'https://platform.flatfile.com/api',
    },
  },
  setup(props) {
    const { space, initializeSpace } = useInitializeSpace(props);
    const initError = ref(null);
    const state = ref({
      localSpaceId: '',
      accessTokenLocal: '',
      spaceUrl: '',
    });
    const spaceUrl = ref('');

    const {
      localSpaceId, accessTokenLocal,
    } = state.value;

    const initSpace = async () => {
      try {
        const data = props.publishableKey
          ? await initializeSpace(props)
          : await getSpace(props);

        if (!data) {
          throw new Error('Failed to initialize space');
        }
        
        const { id: spaceId, accessToken, guestLink } = data.data;

        if (!spaceId) {
          throw new Error('Missing spaceId from space response');
        }

        if (!guestLink) {
          throw new Error('Missing guest link from space response');
        }

        state.value = {
          ...state.value,
          localSpaceId: spaceId,
        };
        spaceUrl.value = guestLink;

        if (!accessToken) {
          throw new Error('Missing access token from space response');
        }

        state.value = {
          ...state.value,
          accessTokenLocal: accessToken,
        };
      } catch (error) {
        initError.value = error.message;
      }
    };

    onMounted(() => {
      initSpace();
    });

    return {
      initSpace,
      initError,
      localSpaceId,
      spaceUrl,
      accessTokenLocal,
    };
  },
  components: {
    SpaceC,
    SpinnerC,
    DefaultError
  },
};
</script>

<style lang="scss">
@import url(./../style.scss);
</style>
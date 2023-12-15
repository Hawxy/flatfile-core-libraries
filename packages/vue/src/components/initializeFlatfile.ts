import { ref, reactive, toRefs, h } from 'vue';
import {initializeSpace} from '../utils/initializeSpace';
import getSpace from '../utils/getSpace';
import { initializePubnub, ISpace } from '@flatfile/embedded-utils'
import SpaceC from './SpaceC.vue';
import SpinnerC from './Spinner.vue';
import Pubnub from 'pubnub';
import DefaultError from './DefaultError.vue';

interface State {
  pubNub: Pubnub | null,
  localSpaceId: string
  accessTokenLocal: string
  spaceUrl: string
  workbook: any
}
export const initializeFlatfile = (props: ISpace) => {
  const {
    error: ErrorElement,
    errorTitle,
    loading: LoadingElement,
    apiUrl = 'https://platform.flatfile.com/api',
  } = props;

  const initError = ref<Error | null>(null);
  const state = reactive<State>({
    pubNub: null,
    localSpaceId: '',
    accessTokenLocal: '',
    spaceUrl: '',
    workbook: null
  });

  const { localSpaceId, pubNub, spaceUrl, accessTokenLocal, workbook } = toRefs(state);

  const initSpace = async () => {
    try {
      const result = (props.publishableKey && !props?.space)
        ? await initializeSpace(props)
        : await getSpace(props);

      const data = result?.space?.data
      const workbook = result?.workbook

      if (!data) {
        throw new Error('Failed to initialize space');
      }

      const { id: spaceId, accessToken, guestLink } = data;

      if (!spaceId) {
        throw new Error('Missing spaceId from space response');
      }

      if (!guestLink) {
        throw new Error('Missing guest link from space response');
      }

      state.localSpaceId = spaceId;
      state.spaceUrl = guestLink;

      if (!accessToken) {
        throw new Error('Missing access token from space response');
      }

      state.accessTokenLocal = accessToken;

      const initializedPubNub = await initializePubnub({
        spaceId,
        accessToken,
        apiUrl,
      });

      state.pubNub = initializedPubNub;
      state.workbook = workbook
    } catch (error) {
      initError.value = error as Error;
    }
  };

  const errorElement = ErrorElement && initError.value ? (
    ErrorElement(initError.value)
  ) : h(DefaultError, {error:errorTitle || initError.value});;

  const loadingElement = LoadingElement || h(SpinnerC);

  return {
    OpenEmbed: initSpace,
    Space: () =>
      pubNub.value ? (
        initError.value ? (
          errorElement
        ) : h(SpaceC, {
            key: localSpaceId.value,
            spaceId: localSpaceId.value,
            spaceUrl: spaceUrl.value,
            accessToken: accessTokenLocal.value,
            pubNub: pubNub.value,
            workbook: workbook.value,
            apiUrl,
            ...props
          })
      ) : (
        loadingElement
      ),
  };
};

export default initializeFlatfile;
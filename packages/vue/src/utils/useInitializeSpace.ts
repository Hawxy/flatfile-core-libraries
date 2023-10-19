import { ref } from '@vue/runtime-dom';
import { ISpace, getErrorMessage } from '@flatfile/embedded-utils';
import authenticate from './authenticate';
import addSpaceInfo from './addSpaceInfo';

const useInitializeSpace = (flatfileOptions: ISpace) => {
  const space = ref();

  const initializeSpace = async () => {
    try {
      const {
        publishableKey,
        environmentId,
        name = 'Embedded Space',
        spaceBody,
        apiUrl,
        spaceUrl = 'https://spaces.flatfile.com/',
        workbook,
      } = flatfileOptions;

      if (!publishableKey) {
        throw new Error('Missing required publishable key');
      }

      if (!environmentId) {
        throw new Error('Missing required environment id');
      }

      const limitedAccessApi = authenticate(publishableKey, apiUrl);
      const spaceRequestBody = {
        name,
        autoConfigure: false,
        ...spaceBody,
      };

      if (!workbook) {
        spaceRequestBody.autoConfigure = true;
      }

      try {
        space.value = await limitedAccessApi.spaces.create({
          environmentId,
          ...spaceRequestBody,
        });
      } catch (error) {
        throw new Error(`Failed to create space: ${getErrorMessage(error)}`);
      }

      if (!space.value) {
        throw new Error(
          `Failed to create space: Error parsing token: ${publishableKey}`,
        );
      }

      if (!space.value.data.accessToken) {
        throw new Error('Failed to retrieve accessToken');
      }

      if (!space.value.data.guestLink) {
        const guestLink = `${spaceUrl}space/${space.value.data.id}?token=${space.value.data.accessToken}`;
        space.value.data.guestLink = guestLink;
      }

      const fullAccessApi = authenticate(space.value.data.accessToken, apiUrl);
      await addSpaceInfo(flatfileOptions, space.value.data.id, fullAccessApi);
      return space.value;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to initialize space: ${message}`);
      throw error;
    }
  };

  return { space, initializeSpace };
};

export default useInitializeSpace;

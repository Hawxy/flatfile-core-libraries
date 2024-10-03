<template>
  <div>
    <DefaultError v-if="initError" :error="initError" />
    <SpaceC
      v-if="localSpaceId && spaceUrl && accessTokenLocal"
      :spaceId="localSpaceId"
      :spaceUrl="spaceUrl"
      :accessToken="accessTokenLocal"
      :apiUrl="apiUrl"
      :displayAsModal="displayAsModal"
      :exitText="exitText"
      :exitTitle="exitTitle"
      :workbook="createdWorkbook"
      :exitPrimaryButtonText="exitPrimaryButtonText"
      :exitSecondaryButtonText="exitSecondaryButtonText"
      :closeSpace="closeSpace"
      :listener="listener"
      :sidebarConfig="sidebarConfig"
      :spaceInfo="spaceInfo"
      :userInfo="userInfo"
      :document="document"
      :themeConfig="themeConfig"
      :environmentId="environmentId"
      :iframeStyles="iframeStyles"
      :onSubmit="onSubmit"
      :onRecordHook="onRecordHook"
    />
    <SpinnerC v-else></SpinnerC>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useInitializeSpace from '../utils/useInitializeSpace'
import getSpace from '../utils/getSpace'
import SpaceC from './SpaceC.vue'
import SpinnerC from './Spinner.vue'
import DefaultError from './DefaultError.vue'
import FlatfileListener from '@flatfile/listener'
import {
  ISpace,
  ISpaceInfo,
  IUserInfo,
  ReusedSpaceWithAccessToken,
  SimpleOnboarding
} from '@flatfile/embedded-utils'

const props = withDefaults(
  defineProps<{
    name?: string
    publishableKey?: string
    environmentId: string
    closeSpace: ISpace['closeSpace']
    space: ReusedSpaceWithAccessToken['space'] | SimpleOnboarding['space']
    themeConfig: ISpace['themeConfig']
    listener: FlatfileListener
    sidebarConfig: SimpleOnboarding['sidebarConfig']
    document: ISpace['document']
    sheet: SimpleOnboarding['sheet']
    spaceBody: ISpace['spaceBody']
    spaceInfo?: Partial<ISpaceInfo>
    userInfo?: Partial<IUserInfo>
    workbook: ISpace['workbook']
    onRecordHook: SimpleOnboarding['onRecordHook']
    onSubmit: SimpleOnboarding['onSubmit']
    displayAsModal: boolean
    iframeStyles: ISpace['iframeStyles']
    mountElement?: string
    exitText?: string
    exitTitle?: string
    exitPrimaryButtonText?: string
    exitSecondaryButtonText?: string
    apiUrl?: string
  }>(),
  {
    mountElement: 'flatfile_iFrameContainer',
    exitText: 'Are you sure you want to exit? Any unsaved changes will be lost.',
    exitTitle: 'Close Window',
    exitPrimaryButtonText: 'Yes, exit',
    exitSecondaryButtonText: 'No, stay',
    apiUrl: 'https://platform.flatfile.com/api'
  }
)

const { initializeSpace, createdWorkbook } = useInitializeSpace(props as SimpleOnboarding)
const initError = ref<string | null>(null)
const localSpaceId = ref<string>('')
const accessTokenLocal = ref<string>('')
const spaceUrl = ref('')

const initSpace = async () => {
  try {
    const data = props.publishableKey && !props?.space
    ? await initializeSpace() 
    : (await getSpace(props as ReusedSpaceWithAccessToken)).space

    if (!data) {
      throw new Error('Failed to initialize space')
    }

    const { id: spaceId, accessToken, guestLink } = data.data

    if (!spaceId) {
      throw new Error('Missing spaceId from space response')
    }

    if (!guestLink) {
      throw new Error('Missing guest link from space response')
    }

    if (!accessToken) {
      throw new Error('Missing access token from space response')
    }

    localSpaceId.value = spaceId
    spaceUrl.value = guestLink
    accessTokenLocal.value = accessToken
  } catch (error) {
    initError.value = (error as Error).message
  }
}

onMounted(() => {
  initSpace()
})
</script>

<style lang="css">
@import url(./../main.css);
</style>

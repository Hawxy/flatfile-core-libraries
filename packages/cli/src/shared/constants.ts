import { EventTopic } from "@flatfile/api"

export const brandHex = '#4C48EF'
export const developerLink = 'https://dashboard.flatfile.com/user/h/development'
export const loginLink = 'https://dashboard.flatfile.com/account/login'
export const accessKeyLink =
  'https://app.flatfile.com/h/a/env/test/account/access-keys'

export const deployTopics = [
  'agent:created',
  'agent:updated',
  'agent:deleted',

  'space:created',
  'space:deleted',
  'space:added', // legacy
  'space:removed', // legacy

  'workbook:created',
  'workbook:deleted',
  'workbook:added', // legacy
  'workbook:removed', // legacy

  'sheet:created',
  'sheet:updated',
  'sheet:deleted',
  'sheet:validated', // legacy

  'record:created',
  'record:updated',
  'record:deleted',
  'records:created', // legacy
  'records:updated', // legacy
  'records:deleted', // legacy

  'file:created',
  'file:updated',
  'file:deleted',
  'upload:started', // legacy
  'upload:failed', // legacy
  'upload:completed', // legacy

  'job:created',
  'job:updated',
  'job:deleted',
  'job:failed',
  'job:completed',
  'job:started', // legacy
  'job:waiting', // legacy
  'action:triggered', // legacy

  'commit:created',
  'commit:updated',
  'layer:created',

  'client:init', // legacy
] as EventTopic[]

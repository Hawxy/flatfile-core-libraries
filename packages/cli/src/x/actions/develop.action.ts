import fs from 'fs'
import path from 'path'
import { Client } from '@flatfile/listener'
import ora from 'ora'
// TODO: Can we do better with these types?
// @ts-expect-error
import readJson from 'read-package-json'
// @ts-expect-error
import ncc from '@vercel/ncc'
import { getAuth } from '../../shared/get-auth'
import { getEntryFile } from '../../shared/get-entry-file'
import { PubSubDriver } from '@flatfile/listener-driver-pubsub'
import { DefaultApi, Configuration } from '@flatfile/api'
import fetch from 'node-fetch'
import { apiKeyClient } from './auth.action'

export async function developAction(
  file?: string | null | undefined,
  options?: Partial<{
    apiUrl: string
    token: string
    env: string
  }>
): Promise<void> {
  const outDir = path.join(process.cwd(), '.flatfile')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  let authRes
  try {
    authRes = await getAuth(options)
  } catch (e) {
    console.log(e)
    return
  }
  const { apiKey, apiUrl, environment } = authRes

  process.env.FLATFILE_BEARER_TOKEN = apiKey
  process.env.FLATFILE_API_KEY = apiKey
  process.env.FLATFILE_SECRET_KEY = apiKey

  file = getEntryFile(file, 'develop')

  if (!file) {
    return
  }

  process.env.AGENT_INTERNAL_URL = apiUrl

  try {
    ora({
      text: `Environment "${environment?.name}" selected`,
    }).succeed()

    // Check if any agents are listed for environment
    const apiClient = apiKeyClient({ apiUrl, apiKey: apiKey! })

    const agents = await apiClient.getAgents({ environmentId: environment.id })
    if (agents?.data && agents?.data?.length > 0) {
      console.log(
        'Looks like you already have deployed agents, please be aware of potentially unintended conflicts with your local development environment. Read more here: https://flatfile.com/docs/developer-tools/developing/running-local#shared-environments'
      )
    }

    const driver = new PubSubDriver(environment.id)

    const watcher = ncc(file, {
      watch: true,
    })

    watcher.handler(async ({ err, code }: { err: any; code: any }) => {
      if (err) {
        console.error(err)
      } else {
        try {
          // const listener = vm.run(code)
          Object.keys(require.cache).forEach(function (id) {
            if (id.includes('develop.js')) {
              delete require.cache[id]
            }
          })
          const listenerPath = path.join(outDir, 'develop.js')
          await fs.promises.writeFile(listenerPath, code)
          const listener = require(listenerPath)
          const devClient = Client.create(listener.default)
          devClient.setVariables({
            accessToken: apiKey,
            apiUrl,
          })

          devClient.mount(driver)
          console.log('\n File change detected. 🚀 ')
        } catch (e) {
          console.error(e)
        }
      }
    })

    await driver.start()
  } catch (e) {
    console.error(e)
  }
}

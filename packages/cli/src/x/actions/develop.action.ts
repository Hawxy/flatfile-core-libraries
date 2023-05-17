import fs from 'fs'
import path from 'path'
import { config } from '../../config'
import { Client, PollingEventDriver } from '@flatfile/listener'
import ora from 'ora'
// TODO: Can we do better with these types?
// @ts-expect-error
import readJson from 'read-package-json'
// @ts-expect-error
import ncc from '@vercel/ncc'
import { getAuth } from '../../shared/get-auth'

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

  file ??= config().entry

  if (!file) {
    const files = [
      path.join(process.cwd(), 'index.js'),
      path.join(process.cwd(), 'src', 'index.js'),
      path.join(process.cwd(), '.build', 'index.js'),
      path.join(process.cwd(), 'dist', 'index.js'),
    ]
    file = files.find((f) => fs.existsSync(f))
  } else {
    file = path.join(process.cwd(), file)
  }
  if (!file) {
    console.error(
      'Could not find a viable entry file. Please specify the exact path to the entry file or add an "entry" configuration to your .flatfilerc'
    )
    return
  }

  process.env.AGENT_INTERNAL_URL = apiUrl

  try {
    ora({
      text: `Environment "${environment?.name}" selected`,
    }).succeed()

    const pollDriver = new PollingEventDriver({
      environmentId: environment.id,
      apiUrl: apiUrl,
      accessToken: apiKey,
    })

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

          devClient.mount(pollDriver)
          pollDriver.start()
          console.log('\n File change detected. 🚀 ')
        } catch (e) {
          console.error(e)
        }
      }
    })
  } catch (e) {
    console.error(e)
  }
}

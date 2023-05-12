import fs from 'fs'
import path from 'path'
import { config } from '../../config'
import { NodeVM } from 'vm2'
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
    ]
    file = files.find((f) => fs.existsSync(f))
  } else {
    file = path.join(process.cwd(), file)
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

    const processMock = {
      env: {
        FLATFILE_API_KEY: apiKey,
        AGENT_INTERNAL_URL: process.env.AGENT_INTERNAL_URL,
      },
    }
    // @ts-expect-error
    processMock[Symbol.toStringTag] = 'process'

    const vm = new NodeVM({
      sandbox: {
        process: processMock,
      },
      require: {
        external: true,
        builtin: ['*'],
        root: './',
      },
      wrapper: 'commonjs',
    })

    watcher.handler(({ err, code }: { err: any; code: any }) => {
      if (err) {
        console.error(err)
      } else {
        try {
          const listener = vm.run(code)

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

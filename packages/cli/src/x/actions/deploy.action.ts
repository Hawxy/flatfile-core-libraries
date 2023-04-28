import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { config } from '../../config'
import { EventTopic } from '@flatfile/api'
import { apiKeyClient } from './auth.action'
import ora from 'ora'

import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import readJson from 'read-package-json'
import terser from '@rollup/plugin-terser'

export async function deployAction(
  file?: string | null | undefined,
  options?: Partial<{
    apiUrl: string
    token: string
  }>
): Promise<void> {
  const outDir = path.join(process.cwd(), '.flatfile')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const apiUrl = options?.apiUrl || config().api_url

  const apiKey =
    options?.token ||
    process.env.FLATFILE_API_KEY ||
    process.env.FLATFILE_SECRET_KEY ||
    process.env.FLATFILE_BEARER_TOKEN

  if (!apiKey) {
    console.log(
      `🛑 You must provide an authentication key. Either set the ${chalk.bold(
        'FLATFILE_API_KEY'
      )} or ${chalk.bold(
        'FLATFILE_BEARER_TOKEN'
      )} environment variable, or pass it as an option to this command with ${chalk.bold(
        '--token'
      )}`
    )
    process.exit(1)
  }

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
  if (!apiUrl) {
    console.log(
      `You must provide a API Endpoint URL. Either set the ${chalk.bold(
        'FLATFILE_API_URL'
      )} environment variable, 'endpoint' in your .flatfilerc or pass the ID in as an option to this command with ${chalk.bold(
        '--endpoint'
      )}`
    )
    process.exit(1)
  }

  const hasListener = await new Promise((resolve, reject) => {
    readJson(
      path.join(process.cwd(), 'package.json'),
      () => {},
      false,
      function (er, data) {
        if (er) {
          console.log(
            'Could not find package.json in the current directory. Deploy flatfile from the root of your project.'
          )
          resolve(-1)
          return
        }

        if (
          data.dependencies?.['@flatfile/listener'] ||
          data.devDependencies?.['@flatfile/listener']
        ) {
          resolve(1)
          return
        }

        // console.log('the package data is', data)
        resolve(0)
      }
    )
  })

  if (hasListener === 0) {
    console.log(
      `You must install the @flatfile/listener package to use the deploy command.`
    )
    process.exit(1)
  }

  try {
    fs.readFile(
      path.join(__dirname, '..', 'templates', 'entry.js'),
      'utf8',
      function (err, data) {
        if (err) {
          return console.log(err)
        }
        const result = data.replace(
          /{ENTRY_PATH}/g,
          path.join(
            path.relative(
              path.dirname(path.join(outDir, '_entry.js')),
              path.dirname(file!)
            ),
            path.basename(file!)
          )
        )

        fs.writeFile(
          path.join(outDir, '_entry.js'),
          result,
          'utf8',
          function (err) {
            if (err) return console.log(err)
          }
        )
      }
    )
    const buildingSpinner = ora({
      text: `Building deployable code package`,
    }).start()
    const bundle = await rollup({
      input: path.join(outDir, '_entry.js'),
      inlineDynamicImports: true,
      plugins: [
        json(),
        commonjs(),
        // injectProcessEnv(config().internal),
        resolve({
          preferBuiltins: false,
        }),
      ],
      // Silences warning about using this being undefined
      onwarn: function (warning) {
        if (
          warning.code === 'THIS_IS_UNDEFINED' ||
          warning.code === 'CIRCULAR_DEPENDENCY' ||
          warning.code === 'UNRESOLVED_IMPORT' ||
          warning.code === 'PLUGIN_WARNING'
        ) {
          return
        }

        console.warn({ message: warning.message })
      },
    })

    const liteMode = process.env.FLATFILE_COMPILE_MODE === 'no-minify'

    await bundle.write({
      file: path.join(outDir, 'build.cjs'),
      format: 'cjs',
      exports: 'auto',
      sourcemap: liteMode ? false : 'inline',
      plugins: liteMode
        ? []
        : [
            // Minifies the bundle
            // TODO: Be able to turn this off for debugging
            terser(),
          ],
    })
    await bundle.close()
    buildingSpinner.succeed('Code package compiled to .flatfile/build.js')
  } catch (e) {
    console.error(e)
  }

  // Create and authenticated API client
  const apiClient = apiKeyClient({ apiUrl, apiKey: apiKey! })

  const validatingSpinner = ora({
    text: `Validating code package...`,
  }).start()
  try {
    const buildFile = path.join(outDir, 'build.cjs')
    const buffer = fs.readFileSync(buildFile)
    const source = buffer.toString()
    const client = require(buildFile)

    if (!('mount' in client)) {
      validatingSpinner.fail(
        'An issue was found in the compiled code. No mount() method detected on client.'
      )
      return
    }

    validatingSpinner.succeed('Code package passed validation')

    const envSpinner = ora({
      text: `Validating environment...`,
    }).start()

    const environments = await apiClient.getEnvironments()

    const environment = environments.data?.[0]
    envSpinner.succeed(`Environment "${environment?.name}" selected`)
    const deployingSpinner = ora({
      text: `Deploying event listener to Flatfile`,
    }).start()

    try {
      const topics = [
        EventTopic.Actiontriggered,
        EventTopic.Clientinit,
        EventTopic.Filedeleted,
        EventTopic.Jobcompleted,
        EventTopic.Jobdeleted,
        EventTopic.Jobfailed,
        EventTopic.Jobstarted,
        EventTopic.Jobupdated,
        EventTopic.Jobwaiting,
        EventTopic.Recordscreated,
        EventTopic.Recordsdeleted,
        EventTopic.Recordsupdated,
        EventTopic.Sheetvalidated,
        EventTopic.Spaceadded,
        EventTopic.Spaceremoved,
        EventTopic.Uploadcompleted,
        EventTopic.Uploadfailed,
        EventTopic.Uploadstarted,
        EventTopic.Useradded,
        EventTopic.Useroffline,
        EventTopic.Useronline,
        EventTopic.Userremoved,
        EventTopic.Workbookadded,
        EventTopic.Workbookremoved,
      ]

      const agent = await apiClient.createAgent({
        environmentId: environment?.id!,
        agentConfig: {
          topics,
          compiler: 'js',
          source,
        },
      })

      deployingSpinner.succeed(
        `Event listener deployed and running on your environment "${
          environment?.name
        }". ${chalk.dim(agent?.data?.id)}\n`
      )
    } catch (e) {
      deployingSpinner.fail(
        `Event listener failed deployment ${chalk.dim(e)}\n`
      )
      console.error(e)
    }
  } catch (e) {
    console.log(e)
  }
}

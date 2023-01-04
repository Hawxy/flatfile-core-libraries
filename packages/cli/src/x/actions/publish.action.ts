import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { info } from '../../legacy/ui/info'
import { config } from '../../config'
import { Blueprint, EventTopic } from '@flatfile/api'
import { authAction } from './auth.action'
import ora from 'ora'

import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { Agent } from '@flatfile/configure'

export async function publishAction(
  file: string,
  options: Partial<{
    account: string
    env: string
    endpoint: string
  }>
) {
  const outDir = path.join(process.cwd(), '.flatfile')

  // TODO: require accountID? Where do we need to use this?
  // const accountId = options.account || config().account
  // if (!accountId) {
  //   console.log(
  //     `You must provide a Account ID. Either set the ${chalk.bold(
  //       'FLATFILE_ACCOUNT_ID'
  //     )} environment variable, 'account' in your .flatfilerc or pass the ID in as an option to this command with ${chalk.bold(
  //       '--account'
  //     )}`
  //   )
  //   process.exit(1)
  // }

  const env = options.env || config().env
  if (!env) {
    console.log(
      `You must provide a Environment ID. Either set the ${chalk.bold(
        'FLATFILE_ENV'
      )} environment variable, 'env' in your .flatfilerc or pass the ID in as an option to this command with ${chalk.bold(
        '--env'
      )}`
    )
    process.exit(1)
  }

  const apiUrl = options.endpoint || config().endpoint
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

  const clientId = config().clientId
  if (!clientId) {
    console.log(`You must provide a secret. Set 'clientId' in your .flatfilerc`)
    process.exit(1)
  }

  const secret = config().secret

  if (!secret) {
    console.log(`You must provide a secret. Set 'secret' in your .flatfilerc`)
    process.exit(1)
  }

  try {
    info('Build Workbook')
    const bundle = await rollup({
      input: file,
      treeshake: true,

      plugins: [
        json(),
        typescript({
          tsconfig: 'tsconfig.json',
          // overriding the default tsconfig.json settings
          declaration: false,
          declarationMap: false,
        }),
        commonjs(),
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

        console.log({ code: warning.code })
        console.warn({ message: warning.message })
      },
    })

    await bundle.write({
      file: path.join(outDir, 'build.js'),
      format: 'cjs',
      exports: 'auto',
      plugins: [
        // Minifies the bundle
        terser(),
      ],
    })
    bundle.close()

    info('Send Build.js')
  } catch (e) {
    console.log(e)
  }

  // Create and authenticated API client
  const apiClient = await authAction({ apiUrl, clientId, secret })

  if (!apiClient) {
    console.log('Failed to create API Client')
    process.exit(1)
  }

  try {
    const envSpinner = ora({
      text: `Find or Create Environment`,
    }).start()
    let environment
    try {
      environment = await apiClient.getEnvironmentById({
        environmentId: env,
      })

      envSpinner.succeed(
        `Found Environment: ${chalk.dim(environment?.data?.id)}`
      )
    } catch (e) {
      envSpinner.fail(`Environment was not found: ${chalk.dim(env)}`)
      process.exit(1)
    }

    const buildFile = path.join(outDir, 'build.js')
    const buffer = fs.readFileSync(buildFile)
    const source = buffer.toString()
    const config = require(buildFile)

    if (!('mount' in config)) {
      return console.error(
        '🛑 You must export a mountable class (Agent, Space, Workbook, or Sheet) as a default export from the entry file.'
      )
    }

    const {
      options: { spaceConfigs },
    } = config.mount() as Agent

    for (const slug in spaceConfigs) {
      const spaceConfigSpinner = ora({
        text: `Create Space Config with slug: ${chalk.dim(slug)}`,
      }).start()
      const spaceConfig = spaceConfigs[slug]
      try {
        const spacePatternConfig = {
          name: spaceConfig.options.name,
          // TODO Do we need a unique slug for this in the Platform SDK or X? Should we generate them in X?
          slug,
          blueprints: mapObj(
            spaceConfig.options.workbookConfigs,
            (wb, wbSlug, i) => {
              return {
                name: wb.options.name,
                slug: `${slug}/${wbSlug}`,
                primary: i === 0,
                sheets: mapObj(wb.options.sheets, (model, modelSlug) =>
                  model.toBlueprint(wbSlug, modelSlug)
                ),
              } as Blueprint
            }
          ),
        }

        const spaceConfigRes = await apiClient.addSpaceConfig({
          spacePatternConfig,
        })
        spaceConfigSpinner.succeed(
          `Space Config Created ${chalk.dim(spaceConfigRes?.data?.id)}`
        )
      } catch (e) {
        spaceConfigSpinner.fail(`Space Config to be created ${chalk.dim(e)}`)
        process.exit(1)
      }
    }

    // Create an Agent with the default Data Hook
    const agentSpinner = ora({
      text: `Create Agent`,
    }).start()
    try {
      const agent = await apiClient.createAgent({
        environmentId: env ?? '',
        agentConfig: {
          topics: [
            EventTopic.Recordscreated,
            EventTopic.Recordsupdated,
            EventTopic.Uploadcompleted,
          ],
          compiler: 'js',
          source,
        },
      })
      agentSpinner.succeed(`Agent Created ${chalk.dim(agent?.data?.id)}\n`)
    } catch (e) {
      agentSpinner.fail(`Agent failed to be created ${chalk.dim(e)}\n`)
    }
  } catch (e) {
    console.log(e)
  }
}

function mapObj<T, K>(
  obj: Record<string, K>,
  cb: (value: K, key: string, i: number) => T
): T[] {
  const slugs = Object.keys(obj)
  let i = 0
  return slugs.map((slug) => {
    const model = obj[slug]
    return cb(model, slug, i++)
  })
}

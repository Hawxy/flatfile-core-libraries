#!/usr/bin/env node
import { build } from 'tsup'
import { program } from 'commander'
import * as path from 'path'
import { deploy } from './deploy'
import packageJSON from '../package.json'
import dotenv from 'dotenv'
import { generateAccessToken } from './auth/acessToken'
import chalk from 'chalk'
import { info } from './ui/info'
import { summary } from './publish/summary'

dotenv.config()

program
  .name('flatfile')
  .description('Flatfile CLI')
  .version(`${packageJSON.version}`)

program
  .command('publish <file>')
  .description('publish a schema')
  .option('-t, --team <team-id>', 'the Team ID to publish to')
  .option('--api-url <url>', 'the API url to use')
  .action(async (file, options) => {
    const teamId = options.team || process.env.FLATFILE_TEAM_ID
    const apiUrl: string =
      options.apiUrl ||
      process.env.FLATFILE_API_URL ||
      'https://api.us.flatfile.io'

    if (!teamId) {
      console.log(
        `You must provide a Team ID. Either set the ${chalk.bold(
          'FLATFILE_TEAM_ID'
        )} environment variable or pass the ID in as an option to this command with ${chalk.bold(
          '--team'
        )}`
      )
      process.exit(1)
    }

    const outDir = path.join(process.cwd(), '.flatfile')

    try {
      info('Build schema')

      await build({
        config: false,
        entry: { build: file },
        outDir,
        format: 'cjs',
        noExternal: [/.*/],
      })
    } catch (e) {
      console.log('Build failed')
      console.log(chalk.red(e))

      process.exit(1)
    }

    info('Generate token')
    const token = await generateAccessToken({ apiUrl })

    info('Deploy schema to Flatfile')

    try {
      const buildFile = path.join(outDir, 'build.js')
      const schemaIds = await deploy(buildFile, {
        apiUrl,
        apiKey: token,
        team: teamId,
      })

      console.log(`🎉 Deploy successful! 🎉`)
      summary({ teamId, apiURL: apiUrl, schemaId: schemaIds[0] })
    } catch (e) {
      console.log('Deploy failed')
      console.log(chalk.red(e))

      process.exit(1)
    }
  })

program.parse()

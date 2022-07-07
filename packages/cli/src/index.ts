#!/usr/bin/env node
import { cosmiconfig } from 'cosmiconfig'

import { build } from 'tsup'
import { program } from 'commander'
import * as path from 'path'
import { deploy } from './deploy'

program
  .name('flatfile')
  .description('Flatfile Developer CLI')
  .version('0.0.1')
  .option('-t, --team <team-id>')
  .option('--api-url <url>')
  .option('--api-key <api-key>')
program.command('publish').requiredOption('-f, --file <file>')

program.parse()

const options = program.opts()

cosmiconfig('flatfile')
  .search()
  .then((result) => {
    const cfg = result?.config || {}

    const team = options.team || process.env.FLATFILE_TEAM_ID || cfg.team
    const apiUrl =
      options.apiUrl ||
      process.env.FLATFILE_API_URL ||
      cfg.apiUrl ||
      'https://api.us.flatfile.io'
    const apiKey = options.apiKey || process.env.FLATFILE_API_KEY || cfg.apiKey

    if (!team) {
      return console.error(
        'You must provide a team id in either a configuration file such as .flatfilerc or as an option to this command with --team'
      )
    }
    if (!options.file) {
      return console.error('You must provide a --file to build')
    }

    if (!apiKey) {
      return console.error(
        'You must provide a flatfile api key to authenticate'
      )
    }
    const outDir = path.join(process.cwd(), '.flatfile')

    build({
      config: false,
      entry: { build: options.file },
      outDir,
      format: 'cjs',
    }).then(() => {
      const buildFile = path.join(outDir, 'build.js')
      deploy(buildFile, {
        apiUrl,
        apiKey,
        team,
      }).then(() => {
        console.log('code is deployed')
      })
      console.log('file is built')
    })
  })

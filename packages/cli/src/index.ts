#!/usr/bin/env node
import { program } from 'commander'
import dotenv from 'dotenv'
import packageJSON from '../package.json'
import { publishAction } from './legacy/actions/publish'
import { init } from './legacy/actions/init/init'

dotenv.config()

program
  .name('flatfile')
  .description('Flatfile CLI')
  .version(`${packageJSON.version}`)

program
  .command('publish')
  .argument(
    '[file]',
    'Path to Workbook file to publish (default: "./src/index.ts")'
  )
  .description('Publish a Workbook')
  .option('-t, --team <team-id>', 'the Team ID to publish to')
  .option('--api-url <url>', 'the API url to use')
  .action(publishAction)

program
  .command('init')
  .description('Initialize a project')
  .option('-e, --environment <env>', 'the Environment to publish to')
  .option('-k, --key <key>', 'the API Key to use')
  .option('-n, --name <name>', 'the name of the your project')
  .option('-s, --secret <secret>', 'the API Secret to use')
  .option('-t, --team <team>', 'the Team ID to publish to')
  .action(init)

program.parse()

#!/usr/bin/env node
import './config'
import { program } from 'commander'
import dotenv from 'dotenv'
import packageJSON from '../package.json'

import { init } from './legacy/actions/init/init'

import { publishAction as legacyPublishAction } from './legacy/actions/publish'
import { publishAction as publishAction } from './x/actions/publish.action'
import { quickstartAction } from './x/actions/quickstart.action'
import { switchVersion } from './switch.version'

dotenv.config()

program
  .name('flatfile')
  .description('Flatfile CLI')
  .version(`${packageJSON.version}`)

program
  .command('publish <file>')
  .description('publish a Workbook')
  .option('-t, --team <team-id>', 'the Team ID to publish to')
  .option('--api-url <url>', 'the API url to use')
  .action(switchVersion(legacyPublishAction, publishAction))

program
  .command('init')
  .description('Initialize a project')
  .option('-e, --environment <env>', 'the Environment to publish to')
  .option('-k, --key <key>', 'the API Key to use')
  .option('-n, --name <name>', 'the name of the your project')
  .option('-s, --secret <secret>', 'the API Secret to use')
  .option('-t, --team <team>', 'the Team ID to publish to')
  .action(init)

program
  .command('quickstart')
  .description('initialize a quickstart Workbook')
  .option('-t, --team <team-id>', 'the Team ID to publish to')
  .option('--api-url <url>', 'the API url to use')
  .action(quickstartAction)

program.parse()

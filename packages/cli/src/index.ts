#!/usr/bin/env node
import './config'
import { program } from 'commander'
import dotenv from 'dotenv'
import packageJSON from '../package.json'

import { publishAction as legacyPublishAction } from './legacy/actions/publish'
import { publishAction as publishAction } from './x/actions/publish.action'
import { quickstartAction } from './x/actions/quickstart.action'
import { switchVersion } from './switch.version'
import { createEnvironmentAction } from './x/actions/create.environment.action'
import { switchInit } from './switch.init'

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
  .option('-x', 'initialize the project to deploy to X')
  .action(switchInit)

program
  .command('quickstart')
  .description('initialize a quickstart Workbook')
  .option('-t, --team <team-id>', 'the Team ID to publish to')
  .option('--api-url <url>', 'the API url to use')
  .action(quickstartAction)

program
  .command('create:env')
  .description('Create an Environment')
  .option('-n, --name <name>', 'the name of the environment to create')
  .option('-k, --key <key>', 'the API Key to use')
  .option('-s, --secret <secret>', 'the API Secret to use')
  .action(createEnvironmentAction)

program.parse()

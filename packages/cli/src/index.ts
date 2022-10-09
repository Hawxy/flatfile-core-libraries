#!/usr/bin/env node
import { program } from 'commander'
import dotenv from 'dotenv'
import packageJSON from '../package.json'
import { publishAction } from './legacy/actions/publish'

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
  .action(publishAction)

program.parse()

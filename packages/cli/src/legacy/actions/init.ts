import inquirer from 'inquirer'
import fs from 'fs'
import chalk from 'chalk'
import ora from 'ora'
const util = require('util')
const exec = util.promisify(require('child_process').exec)

export interface LegacyInitOptions {
  name?: string
  key?: string
  secret?: string
  team?: string
  environment?: string
}

export const init = async (options: LegacyInitOptions) => {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Please name your project',
      default: 'flatfile-platform-example',
      when: !options.name,
    },
    {
      type: 'input',
      name: 'key',
      message: 'Your API key',
      when: !options.key,
    },
    {
      type: 'input',
      name: 'secret',
      message: 'Your API secret',
      when: !options.secret,
    },
    {
      type: 'input',
      name: 'team',
      message: 'Your Team ID',
      when: !options.team,
    },
    {
      type: 'input',
      name: 'environment',
      message: 'Environment name',
      default: 'test',
      when: !options.environment,
    },
  ]

  console.log(`Please signup or login to Flatfile Dashboard with Github.`)
  console.log(`${chalk.dim('https://api.flatfile.io/auth/github')}\n`)

  return inquirer
    .prompt(questions)
    .then(async (answers) => {
      // Combine answers from user input with options passed in via CLI
      const answersWithDefaults: LegacyInitOptions = { ...options, ...answers }
      const { name, key, secret, team, environment } = answersWithDefaults
      const projectDir = `${process.cwd()}/${name}`

      // Empty log for spacing only
      console.log('')
      // Clone starter repo
      const spinner = ora({
        text: `Creating ${chalk.cyan(`${name}`)} project`,
      }).start()

      // Create package scaffold - remove git related information
      try {
        await exec(
          `npx --yes degit FlatFilers/platform-sdk-starter#main ${name}`
        )
      } catch (error) {
        spinner.fail(`Unable to clone starter repository`)
        console.log(chalk.red(error))
        process.exit(1)
      }

      // Change to project directory
      process.chdir(projectDir)

      // Create the .env file
      if (!fs.existsSync('.env')) {
        const template = `FLATFILE_ACCESS_KEY_ID=${key}\nFLATFILE_SECRET=${secret}\nFLATFILE_TEAM_ID=${team}\nFLATFILE_ENV=${environment}`
        fs.writeFileSync('.env', template)
      }

      // Install dependencies
      try {
        await exec(`npm install`)
      } catch (error) {
        spinner.fail(`Unable to install dependencies`)
        console.log(chalk.red(error))
        process.exit(1)
      }
      spinner.succeed(
        `Success! Created ${chalk.cyan(`${name}`)} at ${projectDir}\n`
      )

      console.log(`Start updating your workbook at ${projectDir}/src/index.ts`)
      console.log('Inside that directory, you can run several commands:\n')

      console.log(`  ${chalk.cyan(`npm run dev`)}`)
      console.log('    Starts the bundler in watch mode\n')

      console.log(`  ${chalk.cyan(`npm run build`)}`)
      console.log('    Generate a production bundle\n')

      console.log(`  ${chalk.cyan(`npm run test`)}`)
      console.log('    Start the test runner\n')

      console.log(`  ${chalk.cyan(`npm run lint`)}`)
      console.log('    Lint and fix files\n')

      console.log(`  ${chalk.cyan(`npx flatfile publish`)}`)
      console.log('    Deploy your workbook\n')

      console.log(
        `Optionally, preview an example at ${projectDir}/examples/workbooks/FullExample.ts`
      )

      console.log(
        'You can deploy an example by passing a file path to the publish command. For instance:\n'
      )

      console.log(
        `  ${chalk.cyan(
          `npx flatfile publish ./${name}/examples/workbooks/FullExample.ts`
        )}`
      )
      console.log('    Publish example workbook\n')
    })
    .catch((err) =>
      console.error('There was a problem running the init script', { err })
    )
}

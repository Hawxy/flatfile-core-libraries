import { schemaURL } from './schemaURL'
import boxen from 'boxen'
import chalk from 'chalk'
import { PublishSchema } from './types'

export const summary = ({
  teamId,
  schemaId,
  apiURL,
  env = 'prod',
}: PublishSchema) => {
  const url = schemaURL({
    teamId,
    schemaId,
    apiURL,
    env,
  })
  const teamSummary = `${chalk.whiteBright('TEAM:')}        ${chalk.dim(
    teamId
  )}\n`
  const schemaSummary = `${chalk.whiteBright('SCHEMA:')}      ${chalk.dim(
    schemaId
  )}\n`
  const envSummary = `${chalk.whiteBright('ENVIRONMENT:')} ${chalk.dim(env)}\n`
  const link = `\nView your schema at ${chalk.blue(url)}`

  console.log(
    boxen(`${teamSummary}${schemaSummary}${envSummary}${link}`, {
      title: 'Summary',
      titleAlignment: 'left',
      padding: 1,
      borderColor: 'magenta',
      margin: { top: 2, bottom: 2, right: 0, left: 0 },
    })
  )
}

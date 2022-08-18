import { schemaURL } from './schemaURL'
import boxen from 'boxen'
import chalk from 'chalk'
import { PublishSchemas } from './types'

export const summary = ({
  teamId,
  schemaIds,
  apiURL,
  env = 'test',
}: PublishSchemas) => {
  const teamSummary = `${chalk.whiteBright('TEAM:')}        ${chalk.dim(
    teamId
  )}\n`

  const schemaSummary =
    schemaIds.length > 1
      ? `${chalk.whiteBright('SCHEMAS:')}     ${schemaIds
          .map((schemaId) => chalk.dim(schemaId))
          .join(', ')}\n`
      : `${chalk.whiteBright('SCHEMA:')}      ${chalk.dim(schemaIds[0])}\n`

  const envSummary = `${chalk.whiteBright('ENVIRONMENT:')} ${chalk.dim(
    env
  )}\n\n`
  const URLspaceer = ' '.repeat(21)
  const urls =
    schemaIds.length > 1
      ? schemaIds
          .map(
            (schemaId, index) =>
              `${index > 0 ? URLspaceer : ''}${chalk.blue(
                schemaURL({ teamId, schemaId, apiURL, env })
              )}`
          )
          .join('\n')
      : `${chalk.blue(
          schemaURL({ teamId, schemaId: schemaIds[0], apiURL, env })
        )}`

  const links = `View your schema${schemaIds.length > 1 ? 's' : ''} at ${urls}`

  console.log(
    boxen(`${teamSummary}${schemaSummary}${envSummary}${links}`, {
      title: 'Summary',
      titleAlignment: 'left',
      padding: 1,
      borderColor: 'magenta',
      margin: { top: 2, bottom: 2, right: 0, left: 0 },
    })
  )
}

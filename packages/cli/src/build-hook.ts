import fs from 'fs'
import { GraphQLClient } from 'graphql-request'
import { MUTATION_UPSERT_DATAHOOK } from './MUTATION_UPSERT_DATAHOOK'
import chalk from 'chalk'
import ora from 'ora'

export async function buildPayloadForLambda(
  client: GraphQLClient,
  schemaId: number,
  buildFile: string
) {
  try {
    const data = fs.readFileSync(buildFile, 'utf8')

    const {
      upsertDataHook: { schema: newSchema },
    } = await client.request(MUTATION_UPSERT_DATAHOOK, {
      name: 'Datahook From SDK',
      schemaId,
      code: data,
    })

    ora(`Schema created with id ${chalk.white.bold(newSchema.id)}`).succeed()

    return newSchema.id
  } catch (err) {
    console.log(chalk.red(err))
  }
}

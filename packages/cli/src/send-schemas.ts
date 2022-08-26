// import { buildPayloadForLambda } from './build-hook'
import { GraphQLClient } from 'graphql-request'
import { MUTATION_UPSERT_SCHEMA } from './MUTATION_UPSERT_SCHEMA'
import * as CLIPackage from '../package.json'
import { MUTATION_CREATE_DEPLOYMENT } from './MUTATION_CREATE_DEPLOYMENT'
import fs from 'fs'
import chalk from 'chalk'
import ora from 'ora'

const { npm_package_json } = process.env
let localPackageJSON: {}
if (npm_package_json) {
  localPackageJSON = require(npm_package_json)
}

export const sendSchemasToServer = async (
  client: GraphQLClient,
  buildFile: string,
  options: { team: string; env: string }
): Promise<number[]> => {
  const config = require(buildFile).default
  const { sheets, namespace } = config.options
  const { team, env } = options
  const stringifiedWorkbook = JSON.stringify(config, function (key, val) {
    if (typeof val === 'function') {
      return val.toString()
    }
    return val
  })

  const {
    createDeployment: { id: deploymentId },
  } = await client.request(MUTATION_CREATE_DEPLOYMENT, {
    teamId: options.team,
    version: CLIPackage.version,
    workbook: stringifiedWorkbook,
    ...(localPackageJSON ? { localPackageJSON } : {}),
    environment: env,
  })

  const schemaSlugs = Object.keys(sheets)
  const newSchemaVersions = await Promise.all(
    schemaSlugs.map(async (slug) => {
      const model = sheets[slug]
      const name = model.name
      const sourceCode = fs.readFileSync(buildFile, 'utf8')
      const { previewFieldKey } = model.options
      const schema = await client.request(MUTATION_UPSERT_SCHEMA, {
        slug: `${namespace}/${slug}`,
        teamId: team,
        name,
        jsonSchema: {
          schema: model.toJSONSchema(namespace, slug),
        },
        previewFieldKey,
        deploymentId,
        environment: env,
        code: sourceCode,
      })

      const {
        upsertSchema: { id, slug: newSlug },
      } = schema

      ora(`Workbook created with id ${chalk.white.bold(id)}`).succeed()
      return { id, newSlug }
    })
  )

  return newSchemaVersions.map((schema) => schema.id)
  // return Promise.all(
  //   newSchemaVersions.map(async (schema) => {
  //     return await buildPayloadForLambda(
  //       client,
  //       schema.id,
  //       buildFile,
  //       deploymentId
  //     )
  //   })
  // )
}

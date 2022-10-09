import { GraphQLClient } from 'graphql-request'
import { MUTATION_CREATE_DEPLOYMENT } from './legacy/graphql/MUTATION_CREATE_DEPLOYMENT'
import { MUTATION_UPSERT_EMBED } from './legacy/graphql/MUTATION_UPSERT_EMBED'
import { MUTATION_UPSERT_SCHEMA } from './legacy/graphql/MUTATION_UPSERT_SCHEMA'
import { Portal } from '@flatfile/configure'
import * as CLIPackage from '../package.json'
import chalk from 'chalk'
import fs from 'fs'
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
): Promise<{ schemaIds: number[]; portals: Portal[] }> => {
  const config = require(buildFile).default
  const { sheets, namespace, portals } = config.options
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
        upsertSchema: { id, slug: newSlug, environmentId },
      } = schema

      if (portals) {
        const portal = portals.find((p: Portal) => p.options.sheet === slug)
        if (portal) {
          const { archived, helpContent } = portal.options
          const {
            upsertEmbed: { privateKeyString, embed },
          } = await client.request(MUTATION_UPSERT_EMBED, {
            teamId: team,
            schemaIds: [id],
            name: portal.options.name,
            environmentId,
            archived,
            helpContent,
          })
          portal.setId(embed.id)
          portal.setPrivateKeyString(privateKeyString)
        }
      }

      ora(`Workbook created with id ${chalk.white.bold(id)}`).succeed()
      return { id, newSlug }
    })
  )
  const schemaIds = newSchemaVersions.map((schema) => schema.id)
  return { schemaIds, portals }
}

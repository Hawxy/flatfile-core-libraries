import { buildPayloadForLambda } from './build-hook'
import { GraphQLClient } from 'graphql-request'
import { MUTATION_UPSERT_SCHEMA } from './MUTATION_UPSERT_SCHEMA'

export const sendSchemasToServer = async (
  client: GraphQLClient,
  buildFile: string,
  options: { team: string }
): Promise<number[]> => {
  const config = require(buildFile).default
  const { sheets, namespace } = config.options

  const schemaSlugs = Object.keys(sheets)

  const newSchemaVersions = await Promise.all(
    schemaSlugs.map(async (slug) => {
      const model = sheets[slug]
      const name = model.name
      const schema = await client.request(MUTATION_UPSERT_SCHEMA, {
        slug: `${namespace}/${slug}`,
        teamId: options.team,
        name,
        jsonSchema: {
          schema: model.toJSONSchema(namespace, slug),
        },
      })

      const {
        upsertSchema: { id },
      } = schema

      return id
    })
  )

  return Promise.all(
    newSchemaVersions.map(async (schemaId) => {
      return await buildPayloadForLambda(client, schemaId, buildFile)
    })
  )
}

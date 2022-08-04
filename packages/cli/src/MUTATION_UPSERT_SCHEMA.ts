import { gql } from 'graphql-request'

export const MUTATION_UPSERT_SCHEMA = gql`
  mutation UpsertSchema(
    $slug: String
    $teamId: ID!
    $archived: Boolean
    $jsonSchema: JsonSchemaDto
    $name: String
    $previewFieldKey: String
    $deploymentId: String
    $environment: String
  ) {
    upsertSchema(
      slug: $slug
      teamId: $teamId
      archived: $archived
      jsonSchema: $jsonSchema
      name: $name
      previewFieldKey: $previewFieldKey
      deploymentId: $deploymentId
      environment: $environment
    ) {
      id
      slug
    }
  }
`

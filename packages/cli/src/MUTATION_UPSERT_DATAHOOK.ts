import { gql } from 'graphql-request'

export const MUTATION_UPSERT_DATAHOOK = gql`
  mutation UpsertDataHook(
    $name: String
    $schemaId: String
    $description: String
    $code: String
    $packageJSON: String
    $archived: Boolean
  ) {
    upsertDataHook(
      name: $name
      schemaId: $schemaId
      archived: $archived
      description: $description
      code: $code
      packageJSON: $packageJSON
    ) {
      schema {
        id
      }
      dataHook {
        id
        archived
        name
        description
        code
        packageJSON
        deploymentState
        lambdaARN
        createdAt
        updatedAt
        root {
          id
        }
        ancestor {
          id
        }
      }
    }
  }
`

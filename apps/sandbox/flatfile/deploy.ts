require('dotenv').config()

import example from './setup'
import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { gql, GraphQLClient } from 'graphql-request'
import webpack from 'webpack'
var webpackConfig = require('../webpack.config.js')
var fs = require('fs')
const client = new GraphQLClient(`${process.env.API_URL}/graphql`, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
})

// const MUTATION_CREATE_SCHEMA = gql`
//   mutation CreateSchema(
//     $name: String!
//     $teamId: ID!
//     $jsonSchema: JsonSchemaDto
//     $environmentId: UUID
//   ) {
//     createSchema(
//       teamId: $teamId
//       name: $name
//       jsonSchema: $jsonSchema
//       environmentId: $environmentId
//     ) {
//       id
//       name
//     }
//   }
// `;

const MUTATION_UPDATE_SCHEMA = gql`
  mutation UpdateSchema(
    $slug: String
    $teamId: ID!
    $archived: Boolean
    $jsonSchema: JsonSchemaDto
    $name: String
    $previewFieldKey: String
  ) {
    updateSchema(
      slug: $slug
      teamId: $teamId
      archived: $archived
      jsonSchema: $jsonSchema
      name: $name
      previewFieldKey: $previewFieldKey
    ) {
      id
    }
  }
`

const CREATE_DATAHOOK_SCHEMA = gql`
  mutation CreateDataHook($schemaId: ID!) {
    createDataHook(schemaId: $schemaId) {
      id
      schemaId
    }
  }
`

const UPDATE_DATAHOOK_SCHEMA = gql`
  mutation UpdateDataHook(
    $id: UUID!
    $name: String
    $description: String
    $code: String
    $packageJSON: String
    $archived: Boolean
  ) {
    updateDataHook(
      id: $id
      name: $name
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

async function sendSchemasToServer() {
  const { models, namespace } = example.options
  const schemaSlugs = Object.keys(models)

  const newSchemaVersions = await Promise.all(
    schemaSlugs.map(async (slug) => {
      const model = example.options.models[slug]
      const name = model.name
      return await client.request(MUTATION_UPDATE_SCHEMA, {
        // schemaId: `${namespace}/${slug}`,
        slug: name,
        teamId: '1', // TODO IMPROVE THIS
        name,
        jsonSchema: {
          schema: model.toJSONSchema(),
        },
      })
    })
  )
  newSchemaVersions.map((schema) => {
    const {
      updateSchema: { id },
    } = schema
    buildPayloadForLambda(id)
  })

  // loop through each
  // - publish schema update by key and workbook slug
}

async function runFakeDataHook() {
  const yaml = readFileSync('./fake-hook-payload.yaml').toString()
  const json = parse(yaml)
  const transformed = await example.handleLegacyDataHook(json)
  console.log(JSON.stringify(transformed, null, '  '))
}

async function buildPayloadForLambda(schemaId: number) {
  const compiler = webpack(webpackConfig)

  compiler.run(async (err, stats) => {
    try {
      const data = fs.readFileSync('./dist/hook.js', 'utf8')

      const {
        createDataHook: { id: dataHookID, schemaId: newSchemaId },
      } = await client.request(CREATE_DATAHOOK_SCHEMA, {
        schemaId,
      })

      console.log({
        dataHookID,
        newSchemaId,
      })

      const {
        updateDataHook: { schema: newSchema },
      } = await client.request(UPDATE_DATAHOOK_SCHEMA, {
        id: dataHookID,
        name: 'Datahook From SDK',
        code: data,
      })

      console.log({ newSchemaId: newSchema.id })
    } catch (err) {
      console.log(err)
    }

    //now you can work with the file as you want.
    // console.log({ file });
    compiler.close((closeErr) => {
      // ...
    })
  })
}

// buildPayloadForLambda(39);

// runFakeDataHook();
sendSchemasToServer()

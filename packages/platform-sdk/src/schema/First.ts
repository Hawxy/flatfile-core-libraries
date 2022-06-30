import { IJsonSchema } from '../types'
//import { IJsonSchema } from "@flatfile/platform-sdk/types/ISchema";
import * as _ from 'lodash'


// export type ColSpec = Record<string, any>;
// export type ColumnDesc = Record<string, ColSpec>;

// export class Schema {

//     public finalize() {
// 	// must be explicitly called????
// 	//verify that all foreign keys match up properly
//     }

//     public addModel(m:Model) {

// 	// this or pass Schema into models???
//     }
// }

// export class Model {
//     constructor(
// 	protected tableName: string,
// 	protected columns: ColumnDesc)
//     {}
// }

// export const Contact = new Model("Contact", {
//   name: StringField("Full Name"),
//   email: MyEmailField,
//   phone: StringField("Phone"),
// });

export interface DDLSimpleField {
  type: 'string' | 'number' | 'boolean' | 'composite'
  label: string
  field: string
  //columnName: string;
  required: boolean
  primary?: true
}

export interface DDLSchema {
  fields: DDLSimpleField[]
  unique?: string[]
  primary?: string | string[]
}

export function DDLCompile(ddl: DDLSchema): IJsonSchema {
  const required = _.map(
    ddl.fields.filter((f) => f.required),
    'field'
  )
  const pks = _.map(
    ddl.fields.filter((f) => f.primary),
    'field'
  )
  const strippedPropPairs = ddl.fields.map((f) => [
    f.field,
    _.pick(f, ['type', 'label', 'field']),
  ])
  const pairs = _.fromPairs(strippedPropPairs)

  const retVal: IJsonSchema = {
    properties: pairs,
    type: 'object',
    required: required,
    unique: pks,
    primary: pks[0],
  }
  return retVal
}

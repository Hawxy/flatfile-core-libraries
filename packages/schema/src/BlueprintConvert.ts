import * as _ from 'lodash'
import {
  SchemaILModel,
  BaseSchemaILField,
  SchemaILField,
  SchemaILEnumField,
  LinkedSheetField,
} from './types/SchemaIL'

import {
  Constraint,
  Property,
  StringProperty,
  BooleanProperty,
  EnumProperty,
  EnumPropertyOption,
  NumberProperty,
  SheetConfig,
} from '@flatfile/blueprint'

const getConstraints = (field: SchemaILField): Constraint[] =>
  _.filter([
    field.required ? { type: 'required' } : null,
    field.unique ? { type: 'unqiue' } : null,
  ]) as Constraint[]

const convertBase = (
  field: BaseSchemaILField
): NumberProperty | StringProperty | BooleanProperty => {
  if (field?.stageVisibility?.mapping === false) {
    console.warn('stageVisibility is not yet supported by X')
  }
  if (field?.stageVisibility?.review === false) {
    console.warn('stageVisibility is not yet supported by X')
  }
  if (field?.stageVisibility?.export === false) {
    console.warn('stageVisibility is not yet supported by X')
  }
  if (field.type === 'composite') {
    console.warn("composite fields aren't supported by X")
    // this should never be seen, composite fields aren't used as SchemaILFields
    return {
      key: field.field,
      type: 'string',
      label: field.label,
    }
  }
  return {
    constraints: getConstraints(field),
    type: field.type,
    label: field.label,
    key: field.field,
  }
}

const getEnumOptions = (field: SchemaILEnumField): EnumPropertyOption[] => {
  return _.map(
    _.toPairs(field.labelEnum),
    (pair: string[]): EnumPropertyOption => {
      const [val, label] = pair
      return { value: val, label: label }
    }
  )
}

export const convertEnum = (field: SchemaILEnumField): EnumProperty => {
  if (field.matchStrategy === 'exact') {
    console.warn(
      "X doesn't yet support 'matchStrategy':'exact'.  behavior may be unepxected"
    )
  }
  return {
    constraints: getConstraints(field),
    type: 'enum',
    label: field.label,
    key: field.field,
    config: {
      options: getEnumOptions(field),
    },
  }
}

const convertLinkedField = (silField: LinkedSheetField): StringProperty => {
  console.warn("LinkedFields aren't supported by X")
  return {
    key: silField.field,
    type: 'string',
    label: silField.label,
  }
}

export const SchemaILFieldtoProperty = (field: SchemaILField): Property => {
  const ft = field.type
  if (
    ft === 'string' ||
    ft === 'boolean' ||
    ft === 'number' ||
    ft === 'composite'
  ) {
    return convertBase(field)
  } else if (ft === 'enum') {
    return convertEnum(field)
  } else if (ft === 'schema_ref') {
    return convertLinkedField(field)
  } else {
    throw new Error(
      `unsupported type passed to schemaILFieldtoProperty of ${field}`
    )
  }
}

export const SchemaILModelToSheetConfig = (
  model: SchemaILModel
): SheetConfig => {
  if (model.allowCustomFields === true) {
    console.warn(
      "X doesn't yet support 'allowCustomFields', behavior may be unepxected"
    )
  }
  const fields = _.values(model.fields).map(SchemaILFieldtoProperty)
  return {
    fields,
    name: model.name,
    slug: model.slug,
  }
}

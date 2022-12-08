import {
  SchemaILModel,
  BaseSchemaILField,
  SchemaILField,
  SchemaILEnumField,
} from './types/SchemaIL'
import _ from 'lodash'
import {
  Constraint,
  StringProperty,
  BooleanProperty,
  EnumProperty,
  EnumPropertyOption,
  NumberProperty,
  SheetConfig,
} from '@flatfile/blueprint'

import {
  SchemaILFieldtoProperty,
  SchemaILModelToSheetConfig,
} from './BlueprintConvert'

describe('compiler tests', () => {
  it('checks compiling a string', () => {
    const stringField: SchemaILField = {
      type: 'string',
      label: 'First Name',
      required: true,
      annotations: {},
      field: 'first_name',
    }

    const blueprintOutput: StringProperty = {
      type: 'string',
      label: 'First Name',
      key: 'first_name',
      constraints: [{ type: 'required' }],
    }
    expect(SchemaILFieldtoProperty(stringField)).toStrictEqual(blueprintOutput)
  })

  it('checks compiling an enum', () => {
    const enumField: SchemaILField = {
      type: 'enum',
      matchStrategy: 'fuzzy',
      label: 'Department',
      required: true,
      annotations: {},
      field: 'department',
      labelEnum: {
        engineering: 'Engineering',
        ops: 'Human Resources',
      },
    }

    const blueprintOutput: EnumProperty = {
      type: 'enum',
      key: 'department',
      label: 'Department',
      constraints: [{ type: 'required' }],
      config: {
        options: [
          {
            value: 'engineering',
            label: 'Engineering',
          },
          {
            value: 'ops',
            label: 'Human Resources',
          },
        ],
      },
    }

    expect(SchemaILFieldtoProperty(enumField)).toStrictEqual(blueprintOutput)
  })

  it('checks compiling a number', () => {
    const numberField: SchemaILField = {
      type: 'number',
      label: 'Salary',
      required: true,
      annotations: {},
      field: 'salary',
    }

    const blueprintOutput: NumberProperty = {
      type: 'number',
      key: 'salary',
      label: 'Salary',
      constraints: [{ type: 'required' }],
    }

    expect(SchemaILFieldtoProperty(numberField)).toStrictEqual(blueprintOutput)
  })
})

describe('compiler tests', () => {
  const simpleSheetConfig: SheetConfig = {
    name: 'foo',
    fields: [
      {
        type: 'number',
        key: 'salary',
        label: 'Salary',
        constraints: [{ type: 'required' }],
      },
    ],
  }

  const simpleDdlSchema: SchemaILModel = {
    fields: {
      salary: {
        type: 'number',
        label: 'Salary',
        required: true,
        annotations: {},
        field: 'salary',
      },
    },
    name: 'foo',
    allowCustomFields: false,
    slug: 'test',
    namespace: 'testspace',
  }

  it('checks compiling a simple SchemaILModel ', () => {
    expect(SchemaILModelToSheetConfig(simpleDdlSchema)).toMatchObject(
      simpleSheetConfig
    )
  })

  const complexSheetConfig: SheetConfig = {
    name: 'foo',
    fields: [
      {
        type: 'number',
        key: 'salary',
        label: 'Salary',
        constraints: [{ type: 'required' }],
      },
      {
        type: 'enum',
        key: 'department',
        label: 'Department',
        constraints: [{ type: 'required' }],
        config: {
          options: [
            {
              value: 'engineering',
              label: 'Engineering',
            },
            {
              value: 'ops',
              label: 'Human Resources',
            },
          ],
        },
      },
    ],
  }

  const complexDdlSchema: SchemaILModel = {
    fields: {
      salary: {
        type: 'number',
        label: 'Salary',
        required: true,
        annotations: {},
        field: 'salary',
      },
      department: {
        type: 'enum',
        matchStrategy: 'fuzzy',
        label: 'Department',
        required: true,
        annotations: {},
        field: 'department',
        labelEnum: {
          engineering: 'Engineering',
          ops: 'Human Resources',
        },
      },
    },
    name: 'foo',
    allowCustomFields: false,
    slug: 'test',
    namespace: 'testspace',
  }

  it('checks compiling a more complex SchemaILModel ', () => {
    expect(SchemaILModelToSheetConfig(complexDdlSchema)).toMatchObject(
      complexSheetConfig
    )
  })
})

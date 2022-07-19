import { HookContract, HookProvider } from '../lib/HookProvider'
import { TPrimitive } from '@flatfile/orm'
import {
  FlatfileRecord,
  FlatfileRecords,
  FlatfileSession,
} from '@flatfile/hooks'
import { FlatfileEvent } from '../lib/FlatfileEvent'
import { Field } from './Field'
import {
  IJsonSchema,
  SchemaILModel,
  SchemaILToJsonSchema,
} from '@flatfile/schema'
import { toPairs } from 'remeda'

export class Sheet<
  FC extends FieldConfig
> extends HookProvider<ModelEventRegistry> {
  constructor(
    public name: string,
    public fields: FC,
    public options?: Partial<{
      allowCustomFields: boolean
      readOnly: boolean
      onChange<CB extends FlatfileRecord<Record<keyof FC, TPrimitive>>>(
        record: CB,
        session: FlatfileSession,
        logger: any
      ): CB
    }>
  ) {
    super()

    if (options?.onChange) {
      // @ts-ignore
      this.on('change', (e) => {
        const batch = e.data

        return Promise.all(
          batch.records.map((r: FlatfileRecord) => {
            // @ts-ignore
            return options.onChange(r, e.session)
          })
        )
      })
    }
  }

  public usePlugin(plugin: any, config: any) {}

  public async routeEvents(event: FlatfileEvent<FlatfileRecords<any>>) {
    // handle record events
    switch (event.name) {
      case 'records/change':
        const modelListeners = this.getHookListeners('change')

        // Run first 3 Field hooks: 'cast', 'empty', 'value',
        await Promise.all(
          event.data.records.map(async (r: FlatfileRecord) => {
            await Promise.all(
              toPairs(this.fields).map(async ([key, field]) => {
                return await field.routeEvents({
                  key,
                  event: event.fork('change', r),
                  events: ['cast', 'empty', 'value'],
                })
              })
            )
          })
        )

        // Run onChange record hook
        await Promise.all(modelListeners.map((l) => l(event)))

        // Run first 'validate' Field hook
        await Promise.all(
          event.data.records.map(async (r: FlatfileRecord) => {
            await Promise.all(
              toPairs(this.fields).map(async ([key, field]) => {
                return await field.routeEvents({
                  key,
                  event: event.fork('change', r),
                  events: ['validate'],
                })
              })
            )
          })
        )

        break
    }
    // no-op other events
  }

  public get fieldArray(): Field<any, any>[] {
    const out = []
    for (const key in this.fields) {
      out.push(this.fields[key])
    }
    return out
  }

  public toSchemaIL(namespace: string, slug: string): SchemaILModel {
    let base: SchemaILModel = {
      name: this.name,
      slug,
      namespace,
      fields: {},
    }

    for (const key in this.fields) {
      base = this.fields[key].toSchemaIL(base, key)
    }
    return base
  }

  public toJSONSchema(namespace: string, slug: string): IJsonSchema {
    return SchemaILToJsonSchema(this.toSchemaIL(namespace, slug))
  }
}

export type FieldConfig = Record<string, Field<any, any>>

export type ModelEventRegistry = {
  change: HookContract<FlatfileRecords<any>, void>
}

// fieldA: {
//   hooks: [
//     ['transform', 'package-a@1.01', 'addressCleanUp'],
//     ['cast', 'runtime', '8y9843hyiouahsdf'],
//     ['transform', 'runtime', '8y9843hyiouahsdf', ['parallel', 'high-cpu', 'high-memory', 'lazy']],
// -> HighPerformanceLambda
// ->
//     ['validate', 'runtime', '8y9843hyiouahsdf'],
//   ]
// }

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
import { AsymmetricQueue, getAsymmetricPromise } from '../lib/AsymmetricPromise'

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
        console.log('running change listener')

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

        console.log('foundListeners', modelListeners)
        const castQueue = new AsymmetricQueue<string, number>('cast')
        const computeQueue = new AsymmetricQueue<number, number>('transform')
        const validateQueue = new AsymmetricQueue<number, number>('validate')

        this.fieldArray.forEach((field) => {
          field.getHookListeners('cast').forEach((listener) => {
            castQueue.push(listener)
          })
          field.getHookListeners('compute').forEach((listener) => {
            computeQueue.push(listener)
          })
          field.getHookListeners('validate').forEach((listener) => {
            validateQueue.push(listener)
          })
          const fieldResults: num = getAsymmetricPromise(
            castQueue,
            transformQueue,
            validateQueue
          )
        }, [] as any[])

        // todo: make this run in series tooo
        await Promise.all(modelListeners.map((l) => l(event)))

        // loop through fields and run hooks
        // loop through rows and run hooks
        // any other things
        break
    }
    // no-op other events
  }

  public get fieldArray(): Field<any>[] {
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

export type FieldConfig = Record<string, Field<any>>

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

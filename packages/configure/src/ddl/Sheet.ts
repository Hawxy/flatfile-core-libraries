import { HookContract, HookProvider } from '../lib/HookProvider'
import { TPrimitive } from '@flatfile/orm'
import {
  FlatfileRecords,
  FlatfileSession,
  FlatfileRecord,
} from '@flatfile/hooks'
import { FlatfileEvent } from '../lib/FlatfileEvent'
import { Field } from './Field'
import { IJsonSchema } from '@flatfile/platform-sdk'

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
        session: FlatfileSession
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
        // const fieldListeners = this.fieldArray.reduce((acc, field) => {
        //   return [...acc, ...field.getHookListeners("change")];
        // }, [] as any[]);

        // @ts-ignore
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

  public toJSONSchema() {
    let base: IJsonSchema = {
      name: this.name,
      type: 'object',
      properties: {},
    }

    for (const key in this.fields) {
      base = this.fields[key].toJSONSchema(base, key)
    }
    return base
  }
}

export type FieldConfig = Record<string, Field<any>>

export type ModelEventRegistry = {
  change: HookContract<FlatfileRecords<any>, void>
}

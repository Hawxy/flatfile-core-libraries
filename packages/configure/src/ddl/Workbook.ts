import { FlatfileRecords, FlatfileSession } from '@flatfile/hooks'
import { FlatfileEvent } from '../lib/FlatfileEvent'

export class Workbook {
  constructor(public readonly options: IWorkbookOptions) {}

  public async routeEvents(event: FlatfileEvent<FlatfileRecords<any>>) {
    // find models identified by target
    const targets = Object.keys(this.options.models);
    const foundTarget = targets.find((t) => event.target.includes(t));
    if (foundTarget) {
      await this.options.models[foundTarget].routeEvents(event);
    }
  }

  public toJSONSchema() {
    return Object.values(this.options.models).map((m) => m.toJSONSchema());
  }

  public async handleLegacyDataHook(payload: IHookPayload) {
    const recordBatch = new FlatfileRecords(
      payload.rows.map((r: { row: any }) => r.row)
    );
    const session = new FlatfileSession(payload);
    const event = new FlatfileEvent("records/change", recordBatch, session);
    console.log({ event });
    await this.routeEvents(event);
    return recordBatch.toJSON();
  }

  public runHookOnLambda = async ({
    recordBatch,
    session,
    logger,
    eventType = "records/change",
  }: {
    recordBatch: FlatfileRecords<any>;
    session: FlatfileSession;
    logger: any;
    eventType?: string;
  }) => {
    const event = new FlatfileEvent(eventType, recordBatch, session, logger);
    await this.routeEvents(event);
    return recordBatch.toJSON();
  };
}

export type TPrimitive = string | boolean | number | Date | null;

export type TRecordData<T extends TPrimitive | undefined = TPrimitive> = {
  [key: string]: T;
};

export interface IRawRecord {
  rawData: TRecordData;
  rowId: number;
}
interface IHookPayload {
  workspaceId: string;
  workbookId: string;
  schemaId: number;
  schemaSlug: string;
  uploads: string[];
  rows: any;
  endUser?: any; // TODO
  env?: Record<string, string | boolean | number>;
  envSignature?: string;
}
// target

interface IWorkbookOptions {
  namespace: string;
  name: string;
  models: Record<string, Model<any>>;
  ref?: string;
  options?: {
    // tbd
  };
}

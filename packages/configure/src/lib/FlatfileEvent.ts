import { FlatfileSession } from '@flatfile/hooks'

export class FlatfileEvent<T extends any> {
  public readonly target: string[]

  constructor(
    public readonly name: string,
    public readonly data: T,
    public readonly session: FlatfileSession,
    public readonly logger?: any
  ) {
    this.target = [session.schemaSlug]
  }
}

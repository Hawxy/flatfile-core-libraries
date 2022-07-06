import { FlatfileSession } from '@flatfile/hooks'

export class FlatfileEvent<T extends any, S extends any = any> {
  public readonly target: string[]

  constructor(
    public readonly name: string,
    public readonly data: T,
    public readonly session: FlatfileSession,
    public readonly logger?: any,
    public readonly src?: FlatfileEvent<S>
  ) {
    this.target = [session.schemaSlug]
  }

  public fork<FT>(name: string, data: FT): FlatfileEvent<FT> {
    return new FlatfileEvent<FT>(name, data, this.session, this.logger, this)
  }
}

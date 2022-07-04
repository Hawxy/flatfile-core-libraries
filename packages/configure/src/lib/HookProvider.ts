export class HookProvider<R extends HookRegistry> {
  public hooks: ListenerRegistry<R> = [];

  on<E extends keyof R, HL extends HookListener<E, R>>(event: E, callback: HL) {
    // @ts-ignore
    this.hooks.push({ event, callback });
    return this;
  }

  getHookListeners<E extends keyof R>(event: E): Array<HookListener<E, R>> {
    return this.hooks
    .filter((l) => l.event === event)
    .map((l) => l.callback) as any;
  }

  /**
   * @todo make this be way more sophisticated (parallel, serial, etc)
   * @param e
   * @param raw
   */
  public runHookListeners<E extends keyof R>(
    e: E,
    raw: FlatfileEvent<TupleKey<R[E]>>
  ): Array<Promise<TupleValue<R[E]>>> {
    return this.getHookListeners(e).map(async (cb) => cb(raw));
  }
}

export type ListenerRegistry<R extends HookRegistry> = Array<
  ListenerRegistryEntry<keyof R, R>
  >;

export interface ListenerRegistryEntry<
  E extends keyof R,
  R extends HookRegistry
  > {
  event: E;
  callback: HookListener<E, R>;
}

export type HookListener<
  E extends keyof R,
  R extends HookRegistry,
  T extends R[E] = R[E]
  > = (event: FlatfileEvent<T[0]>) => T[1] | Promise<T[1]>;

export type HookRegistry = Record<any, HookContract<any, any>>;

export type TupleKey<T> = T extends Tuple<infer K> ? K : never;
export type TupleValue<T> = T extends Tuple<any, infer V> ? V : never;
export type Tuple<K extends any = any, V extends any = any> = [K, V];

export type HookContract<Payload, Response> = Tuple<Payload, Response>;

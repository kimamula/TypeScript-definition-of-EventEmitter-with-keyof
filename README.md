# TypeScript definition of EventEmitter with `keyof`

## Definition

With `keyof` introduced by https://github.com/Microsoft/TypeScript/pull/11929, EventEmitter can be defined as follows.

```ts
interface TypedEventEmitter<T> {
  addListener<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this;
  on<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this;
  once<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this;
  removeListener<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this;
  removeAllListeners<K extends keyof T>(event?: K): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  listeners<K extends keyof T>(event: K): ((arg: T[K]) => any)[];
  emit<K extends keyof T>(event: K, arg: T[K]): boolean;
  listenerCount<K extends keyof T>(type: K): number;
  // Added in Node 6...
  prependListener<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this;
  prependOnceListener<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this;
  eventNames(): (string | symbol)[];
}
```

## So what?

The definition of `fs.Writable`, for example, can be rewritten as follows,

```ts
export interface WritableEvents {
  close: void;
  drain: void;
  error: Error;
  finish: void;
  pipe: Readable;
  unpipe: Readable;
}

export class Writable implements events.TypedEventEmitter<WritableEvents>, NodeJS.WritableStream {
  writable: boolean;
  constructor(opts?: WritableOptions);
  protected _write(chunk: any, encoding: string, callback: Function): void;
  write(chunk: any, cb?: Function): boolean;
  write(chunk: any, encoding?: string, cb?: Function): boolean;
  end(): void;
  end(chunk: any, cb?: Function): void;
  end(chunk: any, encoding?: string, cb?: Function): void;
}
```

which is much more DRY and simpler than [what is published in DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/8c65c84d30d181c36ffd00c77f85181e5350ef61/node/index.d.ts#L3262-L3337) (the following).

```ts
export class Writable extends events.EventEmitter implements NodeJS.WritableStream {
    writable: boolean;
    constructor(opts?: WritableOptions);
    protected _write(chunk: any, encoding: string, callback: Function): void;
    write(chunk: any, cb?: Function): boolean;
    write(chunk: any, encoding?: string, cb?: Function): boolean;
    end(): void;
    end(chunk: any, cb?: Function): void;
    end(chunk: any, encoding?: string, cb?: Function): void;

    /**
     * Event emitter
     * The defined events on documents including:
     *   1. close
     *   2. drain
     *   3. error
     *   4. finish
     *   5. pipe
     *   6. unpipe
     **/
    addListener(event: string, listener: Function): this;
    addListener(event: "close", listener: () => void): this;
    addListener(event: "drain", listener: () => void): this;
    addListener(event: "error", listener: (err: Error) => void): this;
    addListener(event: "finish", listener: () => void): this;
    addListener(event: "pipe", listener: (src: Readable) => void): this;
    addListener(event: "unpipe", listener: (src: Readable) => void): this;

    emit(event: string, ...args: any[]): boolean;
    emit(event: "close"): boolean;
    emit(event: "drain", chunk: Buffer | string): boolean;
    emit(event: "error", err: Error): boolean;
    emit(event: "finish"): boolean;
    emit(event: "pipe", src: Readable): boolean;
    emit(event: "unpipe", src: Readable): boolean;

    on(event: string, listener: Function): this;
    on(event: "close", listener: () => void): this;
    on(event: "drain", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "finish", listener: () => void): this;
    on(event: "pipe", listener: (src: Readable) => void): this;
    on(event: "unpipe", listener: (src: Readable) => void): this;

    once(event: string, listener: Function): this;
    once(event: "close", listener: () => void): this;
    once(event: "drain", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: "finish", listener: () => void): this;
    once(event: "pipe", listener: (src: Readable) => void): this;
    once(event: "unpipe", listener: (src: Readable) => void): this;

    prependListener(event: string, listener: Function): this;
    prependListener(event: "close", listener: () => void): this;
    prependListener(event: "drain", listener: () => void): this;
    prependListener(event: "error", listener: (err: Error) => void): this;
    prependListener(event: "finish", listener: () => void): this;
    prependListener(event: "pipe", listener: (src: Readable) => void): this;
    prependListener(event: "unpipe", listener: (src: Readable) => void): this;

    prependOnceListener(event: string, listener: Function): this;
    prependOnceListener(event: "close", listener: () => void): this;
    prependOnceListener(event: "drain", listener: () => void): this;
    prependOnceListener(event: "error", listener: (err: Error) => void): this;
    prependOnceListener(event: "finish", listener: () => void): this;
    prependOnceListener(event: "pipe", listener: (src: Readable) => void): this;
    prependOnceListener(event: "unpipe", listener: (src: Readable) => void): this;

    removeListener(event: string, listener: Function): this;
    removeListener(event: "close", listener: () => void): this;
    removeListener(event: "drain", listener: () => void): this;
    removeListener(event: "error", listener: (err: Error) => void): this;
    removeListener(event: "finish", listener: () => void): this;
    removeListener(event: "pipe", listener: (src: Readable) => void): this;
    removeListener(event: "unpipe", listener: (src: Readable) => void): this;
}
```

## Known limitation

Each event must have exactly one argument.
You cannot define an event with multiple arguments.
Though it is possible to define an event without argument by declaring its argument as `void` (like the `close` event in the above example), you have to emit the event with passing a `void` argument explicitly.

```ts
writable.emit('close'); // error
writable.emit('close', void 0); // ok
```

Hopefully this limitation would be resolved by introducing the feature proposed in https://github.com/Microsoft/TypeScript/issues/5453.

## Run

A sample code (index.ts) can be tested with the following commands.

```bash
$ npm i
$ npm start
```

Enjoy!

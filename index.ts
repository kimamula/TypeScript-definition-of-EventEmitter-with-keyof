const conventionalEventEmitter = new EventEmitter();

conventionalEventEmitter
  .on('foo', (arg: number) => console.log(Math.abs(arg)))
  .on('bar', (arg: string) => console.log(arg.length))
  .on('baz', () => console.log('baz'));

conventionalEventEmitter.emit('foo', 1); // no error
conventionalEventEmitter.emit('foo'); // no error
conventionalEventEmitter.emit('bar', 'bar'); // no error
conventionalEventEmitter.emit('bar', 1); // no error
conventionalEventEmitter.emit('baz'); // no error
conventionalEventEmitter.emit('baz', 'bar'); // no error

const typedEventEmitter = new EventEmitter<{
  foo: number;
  bar: string;
  baz: void;
}>();

typedEventEmitter
  .on('foo', (arg: number) => console.log(Math.abs(arg)))
  .on('bar', (arg: string) => console.log(arg.length))
  .on('baz', () => console.log('baz'));

typedEventEmitter.emit('foo', 1); // no error
typedEventEmitter.emit('foo'); // error
typedEventEmitter.emit('bar', 'bar'); // no error
typedEventEmitter.emit('bar', 1); // error
typedEventEmitter.emit('baz'); // error, unfortunately
typedEventEmitter.emit('baz', void 0); // no error
typedEventEmitter.emit('baz', 'baz'); // error

// Begining of definition

/**
 * conventional definition of EventEmitter retained for backward compatibility
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/8c65c84d30d181c36ffd00c77f85181e5350ef61/node/index.d.ts#L263-L278
 */
interface EventEmitter {
  addListener(event: string | symbol, listener: Function): this;
  on(event: string | symbol, listener: Function): this;
  once(event: string | symbol, listener: Function): this;
  removeListener(event: string | symbol, listener: Function): this;
  removeAllListeners(event?: string | symbol): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  listeners(event: string | symbol): Function[];
  emit(event: string | symbol, ...args: any[]): boolean;
  listenerCount(type: string | symbol): number;
  // Added in Node 6...
  prependListener(event: string | symbol, listener: Function): this;
  prependOnceListener(event: string | symbol, listener: Function): this;
  eventNames(): (string | symbol)[];
}
/**
 * new definition of EventEmitter with keyof
 */
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

interface EventEmitterConstructor {
	new (): EventEmitter;
	new <T>(): TypedEventEmitter<T>;
}

declare var EventEmitter: EventEmitterConstructor;

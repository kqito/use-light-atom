// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EqualFn = (a: any, b: any) => boolean;
export type Listener<T> = (value: T) => void;
export interface IAtom<T> {
  value: T;
  options: AtomOptions;
  subscribe: (listener: Listener<T>) => void;
  unsubscribe: (listener: Listener<T>) => void;
}
export type AtomValue<T> = T extends Atom<infer U> ? U : never;
export type AtomOptions = {
  equalFn: EqualFn;
};
export type CreateAtom = <T>(
  value: T,
  atomOptions?: Partial<AtomOptions>
) => Atom<T>;

class Atom<T> implements IAtom<T> {
  private __value: T;
  private __listeners: Array<Listener<T>>;
  public options: AtomOptions;

  constructor(value: T, atomOptions: AtomOptions) {
    this.__value = value;
    this.__listeners = [];
    this.options = atomOptions;
  }

  get value(): T {
    return this.__value;
  }

  set value(value: T) {
    this.__value = value;
    this.dispatch(this.__value);
  }

  subscribe(listener: Listener<T>) {
    this.__listeners.push(listener);
  }

  unsubscribe(listener: Listener<T>) {
    const index = this.__listeners.indexOf(listener);

    if (index > -1) {
      this.__listeners.splice(index, 1);
    }
  }

  private dispatch(...listenerArgs: Parameters<Listener<T>>) {
    for (const listener of this.__listeners) {
      listener(...listenerArgs);
    }
  }
}

export const createAtom: CreateAtom = (value, { equalFn } = {}) =>
  new Atom(value, {
    equalFn: equalFn || Object.is,
  });

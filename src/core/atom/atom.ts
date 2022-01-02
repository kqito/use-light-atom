// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EqualFn = (a: any, b: any) => boolean;
export type Listener<T> = (value: T) => void;
export type Unsubscribe = () => void;
export interface IAtom<T> {
  getValue: () => T;
  setValue: (value: T) => void;
  options: AtomOptions;
  subscribe: (listener: Listener<T>) => Unsubscribe;
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
  public options: AtomOptions;
  private __value: T;
  private __listeners: Array<Listener<T>>;

  constructor(value: T, atomOptions: AtomOptions) {
    this.__value = value;
    this.__listeners = [];
    this.options = atomOptions;
  }

  getValue() {
    return this.__value;
  }

  setValue(value: T) {
    this.__value = value;
    this.dispatch();
  }

  subscribe(listener: Listener<T>): Unsubscribe {
    this.__listeners.push(listener);

    const unsubscribe = () => {
      this.unsubscribe(listener);
    };

    return unsubscribe;
  }

  unsubscribe(listener: Listener<T>) {
    const index = this.__listeners.indexOf(listener);

    if (index > -1) {
      this.__listeners.splice(index, 1);
    }
  }

  private dispatch() {
    for (const listener of this.__listeners) {
      listener(this.__value);
    }
  }
}

export const createAtom: CreateAtom = (value, { equalFn } = {}) =>
  new Atom(value, {
    equalFn: equalFn || Object.is,
  });

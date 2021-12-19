// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EqualFn = (a: any, b: any) => boolean;
export type Atom<T> = {
  key: string;
  value: T;
  options: AtomOptions;
  meta: AtomMeta<T>;
};
export type AtomValue<T> = T extends Atom<infer U> ? U : never;
export type AtomMeta<T> = {
  isPreload: boolean;
  initialValue: T;
};
export type AtomOptions = {
  equalFn: EqualFn;
};
export type CreateAtom = {
  <T>(key: string, value: T, atomOptions?: Partial<AtomOptions>): Atom<T>;
};

export const createBaseAtom =
  ({ isPreload }: { isPreload: boolean }): CreateAtom =>
  (key, value, { equalFn = Object.is } = {}) => ({
    key,
    value,
    meta: {
      isPreload,
      initialValue: value,
    },
    options: {
      equalFn,
    },
  });

export const createAtom: CreateAtom = (key, value, atomOptions) =>
  createBaseAtom({ isPreload: false })(key, value, atomOptions);
export const createPreloadAtom: CreateAtom = (key, value, atomOptions) =>
  createBaseAtom({ isPreload: true })(key, value, atomOptions);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EqualFn = (a: any, b: any) => boolean;
export type Atom<T> = {
  key: string;
  value: T;
  equalFn: EqualFn;
};

export type CreateAtomOptions = {
  equalFn?: EqualFn;
};

export type CreateAtom = {
  <T>(key: string, value: T, createAtomOptions?: CreateAtomOptions): Atom<T>;
};

export const createAtom: CreateAtom = (
  key,
  value,
  { equalFn = Object.is } = {}
) => {
  return {
    key,
    value,
    equalFn,
  };
};

export type Atom<T> = {
  key: string;
  value: T;
};

export type CreateAtom = {
  <T>(key: string, value: T): Atom<T>;
};

export const createAtom: CreateAtom = (key, value) => {
  return {
    key,
    value,
  };
};

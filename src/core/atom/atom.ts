// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EqualFn = (a: any, b: any) => boolean;
export type Atom<T> = {
  key: string;
  value: T;
  options: AtomOptions;
  meta: AtomMeta;
};
export type AtomValue<T> = T extends Atom<infer U> ? U : never;
export type AtomMeta = {
  initialValue: string;
};
export type AtomOptions = {
  equalFn: EqualFn;
};
export type CreateAtom = <T>(
  value: T,
  atomOptions?: Partial<AtomOptions>
) => Atom<T>;

let atomNumer = 0;
const createAtomKey = () => `atom-${atomNumer++}`;

export const createAtom: CreateAtom = (value, { equalFn } = {}) => ({
  key: createAtomKey(),
  value,
  meta: {
    initialValue:
      typeof value === 'object' ? JSON.stringify(value) : String(value),
  },
  options: {
    equalFn: equalFn || Object.is,
  },
});

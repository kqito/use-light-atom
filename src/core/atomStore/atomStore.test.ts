import { createDevlogMock } from '../../testUtils/devlogMock';
import { createAtom } from '../atom/atom';
import { createAtomStore } from './atomStore';

describe('atomStore', () => {
  const spyOnDevlog = createDevlogMock();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Register atoms', () => {
    const userAtom = createAtom({
      name: 'example',
      age: 22,
    });

    const counterAtom = createAtom(0);

    const atomStore = createAtomStore();

    expect(atomStore.getAtoms()).toEqual({});

    expect(atomStore.setAtom(userAtom)).toEqual(userAtom);
    expect(atomStore.getAtoms()).toEqual({
      [userAtom.key]: userAtom,
    });

    expect(atomStore.setAtom(counterAtom)).toEqual(counterAtom);
    expect(atomStore.getAtoms()).toEqual({
      [userAtom.key]: userAtom,
      [counterAtom.key]: counterAtom,
    });
  });

  test('Try to Register duplicated atoms has same key and value', () => {
    const userAtom = createAtom({
      name: 'example1',
      age: 22,
    });

    const atomStore = createAtomStore({ isDebugMode: true });

    expect(atomStore.setAtom(userAtom)).toEqual(userAtom);
    expect(atomStore.getAtoms()).toEqual({
      [userAtom.key]: userAtom,
    });
    expect(spyOnDevlog).toBeCalledTimes(0);

    expect(atomStore.setAtom(userAtom)).toEqual(userAtom);
    expect(atomStore.getAtoms()).toEqual({
      [userAtom.key]: userAtom,
    });
    expect(spyOnDevlog).toBeCalledTimes(0);
  });
});

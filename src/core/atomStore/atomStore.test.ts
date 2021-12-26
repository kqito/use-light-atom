import { createAtom } from '../atom/atom';
import { createAtomStore } from './atomStore';
import * as devLogObject from '../../utils/devlog';

describe('atomStore', () => {
  const spyOnDevlog = jest
    .spyOn(devLogObject, 'devlog')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Register atoms', () => {
    const userAtom = createAtom('user', {
      name: 'example',
      age: 22,
    });

    const counterAtom = createAtom('counter', 0);

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

  test('Try to Register duplicated atoms has same key and not same value', () => {
    const duplicatedKey = 'user';
    const user1Atom = createAtom(duplicatedKey, {
      name: duplicatedKey + '1',
      age: 22,
    });

    const user2Atom = createAtom(duplicatedKey, {
      name: duplicatedKey + '2',
      age: 22,
    });

    const atomStore = createAtomStore({ isDebugMode: true });

    expect(atomStore.setAtom(user1Atom)).toEqual(user1Atom);
    expect(atomStore.getAtoms()).toEqual({
      [duplicatedKey]: user1Atom,
    });
    expect(spyOnDevlog).toBeCalledTimes(0);

    expect(atomStore.setAtom(user2Atom)).toEqual(user2Atom);
    expect(atomStore.getAtoms()).toEqual({
      [duplicatedKey]: user2Atom,
    });
    expect(spyOnDevlog).toBeCalledTimes(1);
  });

  test('Try to Register duplicated atoms has same key and value', () => {
    const userAtom = createAtom('user', {
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

import deepEqual from 'fast-deep-equal';
import { createAtom } from './atom';

describe('atom', () => {
  test('Create atom', () => {
    const countAtom = createAtom(0);
    const userWithEqualFnAtom = createAtom(
      { name: 'John', age: 22 },
      { equalFn: deepEqual }
    );

    expect(countAtom.value).toBe(0);
    expect(userWithEqualFnAtom.value).toEqual({ name: 'John', age: 22 });
    expect(userWithEqualFnAtom.options.equalFn).toEqual(deepEqual);
  });

  test('Subscribe atom', () => {
    const countAtom = createAtom(0);
    const mockFn = jest.fn();

    countAtom.subscribe(mockFn);

    const newNumber1 = 100;
    countAtom.value = newNumber1;

    expect(countAtom.value).toBe(newNumber1);
    expect(mockFn).toBeCalledTimes(1);

    const newNumber2 = 1000;
    countAtom.value = newNumber2;

    expect(countAtom.value).toBe(newNumber2);
    expect(mockFn).toBeCalledTimes(2);

    countAtom.unsubscribe(mockFn);
    const newNumber3 = 10000;
    countAtom.value = newNumber3;

    expect(countAtom.value).toBe(newNumber3);
    expect(mockFn).toBeCalledTimes(2);
  });
});

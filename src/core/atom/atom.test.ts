import deepEqual from 'fast-deep-equal';
import { createAtom } from './atom';

describe('atom', () => {
  test('Create atom', () => {
    const countAtom = createAtom(0);
    const userWithEqualFnAtom = createAtom(
      { name: 'John', age: 22 },
      { equalFn: deepEqual }
    );

    expect(countAtom.getValue()).toBe(0);
    expect(userWithEqualFnAtom.getValue()).toEqual({ name: 'John', age: 22 });
    expect(userWithEqualFnAtom.options.equalFn).toEqual(deepEqual);
  });

  test('Subscribe atom', () => {
    const countAtom = createAtom(0);
    const mockFn = jest.fn();

    countAtom.subscribe(mockFn);

    const newNumber1 = 100;
    countAtom.setValue(newNumber1);

    expect(countAtom.getValue()).toBe(newNumber1);
    expect(mockFn).toBeCalledTimes(1);

    const newNumber2 = 1000;
    countAtom.setValue(newNumber2);

    expect(countAtom.getValue()).toBe(newNumber2);
    expect(mockFn).toBeCalledTimes(2);
  });

  test('UnSubscribe atom', () => {
    const countAtom = createAtom(0);
    const unsubscribeMockFn = jest.fn();
    const returnSubscribeMockFn = jest.fn();

    const unsubscribe = countAtom.subscribe(returnSubscribeMockFn);
    countAtom.subscribe(unsubscribeMockFn);

    const newNumber1 = 100;
    countAtom.setValue(newNumber1);

    expect(countAtom.getValue()).toBe(newNumber1);
    expect(unsubscribeMockFn).toBeCalledTimes(1);
    expect(returnSubscribeMockFn).toBeCalledTimes(1);

    const newNumber2 = 1000;
    unsubscribe();
    countAtom.setValue(newNumber2);

    expect(countAtom.getValue()).toBe(newNumber2);
    expect(unsubscribeMockFn).toBeCalledTimes(2);
    expect(returnSubscribeMockFn).toBeCalledTimes(1);

    const newNumber3 = 10000;
    countAtom.unsubscribe(unsubscribeMockFn);
    countAtom.setValue(newNumber3);

    expect(countAtom.getValue()).toBe(newNumber3);
    expect(unsubscribeMockFn).toBeCalledTimes(2);
    expect(returnSubscribeMockFn).toBeCalledTimes(1);
  });
});

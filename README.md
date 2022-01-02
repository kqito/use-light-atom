<h3 align="center">
  use-light-atom
</h3>

<p align="center">
   Lightweight atom-based state management for react
</p>

<p align="center">
  <a href="https://github.com/kqito/use-light-atom/actions/workflows/test.yml"><img src="https://github.com/kqito/use-light-atom/workflows/Test/badge.svg" alt="Build status"></a>
  <a href="https://badge.fury.io/js/use-light-atom"><img src="https://badge.fury.io/js/use-light-atom.svg" alt="Npm version"></a>
  <a href="https://github.com/kqito/use-light-atom/blob/main/LICENSE"><img src="https://img.shields.io/github/license/kqito/use-light-atom" alt="License"></a>
  <img src="https://img.shields.io/bundlephobia/minzip/use-light-atom" alt="Bundle size">
</p>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [API](#api)

## Features
- Lightweight (less than 2kB size)
- Simple interface
- Code splitting of state
- Support for SSR

## Installation
We can install the package from npm.

```
npm insttll use-light-atom
```

or

```
yarn add use-light-atom
```

## Usage
We can use `use-light-atom` as following.

```tsx
import { useAtom, createAtom } from 'use-light-atom'

export const counterAtom = createAtom(0);

export const Counter = () => {
  const [count, setCountState] = useAtom(counterAtom);

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setCountState((count) => count + 1)}>
        Increment
      </button>
      <button onClick={() => setCountState((count) => count - 1)}>
        Decrement
      </button>
    </div>
  );
};
```

## Examples
The following are some example of how to use `use-light-atom`.

### Basic
We can use the state and the function to update it from atom as follows

```tsx
import { useAtom, createAtom } from 'use-light-atom'

export const counterAtom = createAtom(0);

export const userAtom = createAtom({
  age: 22,
  name: 'kqito'
});

export const Counter = () => {
  const [count, setCountState] = useAtom(counterAtom);
  // get only state without setState function
  const userState = useAtomState(userAtom);
  // get only setState function without state
  const setUserState = useAtomSetState(userAtom);

  return (
    <div>
      <p>Counter: {count}</p>
        <button onClick={() => setCountState((count) => count + 1)}>
          Increment
        </button>
        <button onClick={() => setCountState((count) => count - 1)}>
          Decrement
        </button>
    </div>
  );
};
```

### Updating state outside of react
We can update the state by rewriting the `atom.value` directly.

This is useful when writing operations outside of the react lifecycle.

```tsx
import { useAtomState, createAtom } from 'use-light-atom'

type AsyncData = string | undefined
export const dataAtom = createAtom<AsyncData>();

export const DataDisplayer = () => {
  const data = useAtomState(dataAtom);

  if ( data === undefined ) {
    return null
  }

  return (
    <p>{data}</p>
  );
};
```

```tsx
// DataDisplayer will return null
dataAtom.setValue(undefined)

// DataDisplayer will return 'hogehoge' with rerender
dataAtom.setValue('hogehoge')
```


### Subscribe atom

By using `atom.subscribe`, we can have a side effect when the value of atom is changed.

```ts
const counterAtom = createAtom(0);

counterAtom.subscribe((counter: number) => {
  console.log(`count is ${counter} now`)
})

// counterAtom will output 'count is 100 now' log
counterAtom.setValue(100)
```


### Selector

If specify `selector`, we can extract only the necessary values from the atom

```tsx
import { useAtomState, createAtom } from 'use-light-atom'

export const userAtom = createAtom({
  age: 22,
  name: 'kqito'
});

export const Counter = () => {
  const age = useAtomState(counterAtom, { selector: ({ age }) => age });
  // The following code is same as the above
  // const [ age ] = useState(counterAtom, { selector: ({ age }) => age });

  return (
    <div>
      <p>Age: {age}</p>
    </div>
  );
};
```

### With deep equal
If you want to change the equal function, you can specify the equalFn option. (default: `Object.is`)

```tsx
import { useAtomState, createAtom } from 'use-light-atom'

export const counterAtom = createAtom(0, {
  // we can specify default equalFn
  equalFn: deepEqual
});

export const Counter = () => {
  // we can speicfy equalFn
  const count = useAtomState(counterAtom, { equalFn: deepEqual });

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
};
```

### Static Generation with Next.js

At first, pages component file you want to SG should look like this


```tsx
import type { GetStaticProps, NextPage } from 'next';
import { createAtom, useAtomState } from 'use-light-atom';

const countAtom = createAtom(0);

const CounterPage: NextPage = () => {
  const count = useAtomState(countAtom);

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
};

export default CounterPage;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      preloadValues: {
        [countAtom.key]: 100,
      },
    },
  };
};
```

Next, you can use the `useMergeAtom` hooks as following.


```tsx
import type { GetStaticProps, NextPage } from 'next';
import { createAtom, useAtomState, useMergeAtom } from 'use-light-atom';

const countAtom = createAtom(0);

const CounterPage: NextPage = ({ preloadValues }) => {
  const setter = useCallback(() => preloadValues.counter, [preloadValues.counter])
  useMergeAtom(countAtom, setter)
  const count = useAtomState(countAtom);

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
};

export default CounterPage;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      preloadValues: {
        [countAtom.key]: 100,
      },
    },
  };
};
```

## API
### `useAtom` hooks

```tsx
const [state, setState] = useAtom(atom, { selector, equalFn });
```

`useAtom` is a hooks to get the state of an atom and the function to update it.

#### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

- `selector` (type: `(state: T) => S | undefined`)
   - Function option that allows you to extract only the state you need from the atom.

- `equalFn` (type: `(a: any, b: any) => boolean`)
  - A function that compares the current value with the next value when it changes.
  - If `equalFn` is not specified, the `equalFn` specified in atom will be applied.
  - If the return value is true, re-rendering will occur.


#### Returns
- `state` (type: `T`)
  - State of the atom specified in the argument.

- `setState` (type: `(newState: ((state: T) => T) | T) => void`)
  - Function to update the state.

---

### `useAtomState` hooks

```tsx
const state = useAtomState(atom, { selector, equalFn });
```

`useAtomState` is a hooks to get the state of an atom.

#### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

- `selector` (type: `(state: T) => S | undefined`)
   - Function option that allows you to extract only the state you need from the atom.

- `equalFn` (type: `(a: any, b: any) => boolean`)
  - A function that compares the current value with the next value when it changes.
  - If `equalFn` is not specified, the `equalFn` specified in atom will be applied.
  - If the return value is true, re-rendering will occur.

#### Returns
- `state` (type: `T`)
  - State of the atom specified in the argument.

---

### `useAtomSetState` hooks

```tsx
const setState = useAtomState(atom);
```

`useAtomState` is a hooks to get the state of an atom.

#### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

#### Returns
- `setState` (type: `(newState: ((state: T) => T) | T) => void`)
  - Function to update the state.

---

### `createAtom` function

```tsx
const atom = createAtom(value, { equalFn });
```

`createAtom` is a function to create atom.

#### Arguments
- `value` (type: `T`)
  - Initial value of atom.

- `equalFn` (type: `(a: any, b: any) => boolean`)
  - If no equalFn option such as useAtom hooks is specified, this value will be applied.
  - Default is `Object.is`.
  - A function that compares the current value with the next value when it changes.
  - If the return value is true, re-rendering will occur.

---

### `useMergeAtom` hooks

```tsx
useMergeAtom(atom, mergeFn)
```

`useMergeAtom` is a hooks that synchronously rewrites the value of atom.

Whenever the value of the atom argument is updated, the `mergeFn` function will be executed.

#### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

- `mergeFn` (type: `(prevState: T) => T | undefined`)
  - If it returns `T`, it will apply the update as the value of atom.
  - If it returns `undefined`, no update will be performed.

## License
[MIT © kqito](./LICENSE)

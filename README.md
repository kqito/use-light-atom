<h3 align="center">
  use-light-atom
</h3>

<p align="center">
   A lightweight atom-based state management for react
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
- Lightweight (less than 3kB size)
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
import { AtomStoreProvider, useAtom, createAtom } from 'use-light-atom'

export const counterAtom = createAtom('counter', {
  count: 0
});

export const Counter = () => {
  const [{ count }, setCountState] = useAtom(counterAtom);

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setCountState(({ count }) => { count: count + 1 })}>
        Increment
      </button>
      <button onClick={() => setCountState(({ count }) => { count: count - 1 })}>
        Decrement
      </button>
    </div>
  );
};

const App = () => (
  <AtomStoreProvider>
    <Counter />
  </AtomStoreProvider>
)
```

## Examples
The following are some example of how to use `use-light-atom`.

Note that the `AtomStoreProvider` must be specified as the parent or higher element.

### Basic
We can use the state and the function to update it from atom as follows

```tsx
import { useAtom, createAtom } from 'use-light-atom'

export const counterAtom = createAtom('counter', {
  count: 0
});

export const userAtom = createAtom('userInfomation', {
  age: 22,
  name: 'kqito'
});

export const Counter = () => {
  const [{ count }, setCountState] = useAtom(counterAtom);
  // get only state without setState function
  const userState = useAtomState(userAtom);
  // get only setState function without state
  const setUserState = useAtomSetState(userAtom);

  return (
    <div>
      <p>Counter: {count}</p>
        <button onClick={() => setCountState({ count: count + 1 })}>
          Increment
        </button>
        <button onClick={() => setCountState({ count: count - 1 })}>
          Decrement
        </button>
    </div>
  );
};
```

### Selector

If specify `selector`, we can extract only the necessary values from the atom

```tsx
import { useAtomState, createAtom } from 'use-light-atom'

export const userAtom = createAtom('userInfomation', {
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

export const counterAtom = createAtom('counter',
  {
    count: 0
  },
  {
    // we can specify default equalFn
    equalFn: deepEqual
  }
);

export const Counter = () => {
  // we can speicfy equalFn
  const countState = useAtomState(counterAtom, { equalFn: deepEqual });

  return (
    <div>
      <p>Counter: {countState.count}</p>
    </div>
  );
};
```


### Static Generation with Next.js

Allow _app to pass initial values to the store by doing the following.

```tsx
import { StoreProvider } from 'use-light-atom';

function MyApp({ Component, pageProps }) {
  const { preloadValues } = pageProps;

  return (
    <StoreProvider preloadValues={preloadValues}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
```

Next, the pages component file you want to SG should look like this


```tsx
import type { GetStaticProps, NextPage } from 'next';
import { createAtom, useAtomState } from 'use-light-atom';

const countAtom = createAtom('counter', 0);

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
  - A function that compares the current value of store with the value of store when it changes.
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
const state = useAtomState(atom, useAtomStateOptions);
```

`useAtomState` is a hooks to get the state of an atom.

#### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

- `useAtomStateOptions` (type: `UseAtomStateOptions<T>`)
  - same as `useAtomOptions`.

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
const atom = createAtom(key, value, { equalFn });
```

`createAtom` is a function to create atom.

#### Arguments
- `key` (type: `string`)
  - The atom key must be unique.

- `value` (type: `T`)
  - Initial value of atom.

- `equalFn` (type: `(a: any, b: any) => boolean`)
  - If no equalFn option such as useAtom hooks is specified, this value will be applied.
  - Default is `Object.is`.
  - A function that compares the current value of store with the value of store when it changes.
  - If the return value is true, re-rendering will occur.

---

### `createPreloadAtom` function

```tsx
const atom = createPreloadAtom(key, value, { equalFn });
```

`createPreloadAtom` is a function to create preload atom.

`Preload atom` can be used when you want to use a SSG value as the initial value.

#### Arguments
same as `createAtom`

#### Returns
- `atom` (type: `Atom<T>`)
  - Atom available for useAtom hooks, etc.

---

### `AtomStoreProvider` component

```tsx
 <AtomStoreProvider atomStore={atomStore} preloadValues={preloadValues}>
  { children here... }
 </AtomStoreProvider>
```

`AtomStoreProvider` is a component for managing atom.

**In order to use the useAtom hooks etc, you need to set the `AtomStoreProvider` on the parent or higher element.**

#### Props
- `atomStore` (type: `AtomStore | undefined`)
  - props to set the store created by the `createAtomStore` function to Provider

- `preloadValues` (type: `Record<string, unknown> | undefined`)
  - props used to store key and value as a preload atom.
  - This is useful for inheriting SSR values.

---

### `createAtomStore` function

```tsx
const atomStore = createAtomStore()
```

`createAtomStore` is a function that creates a store. It is mainly used for SSR.

---

### AtomStore
- `AtomStore.getAtoms` (type:  `Record<string, unknown>`)
  - Function to get the atoms stored in the store.

---

### `useAtomStore` hooks

```tsx
const atomStore = useAtomStore()
```

`useAtomStore` is a hooks that get store in `AtomStoreProvider`.

## License
[MIT © kqito](./LICENSE)

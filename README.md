<h3 align="center">
  use-simple-atom
</h3>

<p align="center">
   A simple atom-based state management for react
</p>

<p align="center">
  <a href="https://github.com/kqito/use-simple-atom/actions/workflows/test.yml"><img src="https://github.com/kqito/use-simple-atom/workflows/Test/badge.svg" alt="Build status"></a>
  <a href="https://badge.fury.io/js/use-simple-atom"><img src="https://badge.fury.io/js/use-simple-atom.svg" alt="Npm version"></a>
  <a href="https://github.com/kqito/use-simple-atom/blob/main/LICENSE"><img src="https://img.shields.io/github/license/kqito/use-simple-atom" alt="License"></a>
</p>

## Features
- A simple atom library
- Lightweight ( less than 5kB size )
- No dependencies
- Support for SSR
- Prevents the unnecessary renders

## Installation
You can install the package from npm.

```
npm install use-simple-atom
```

or

```
yarn add use-simple-atom
```

## Usage
We can use `use-simple-atom` as following.

```tsx
import { AtomStoreProvider, useAtom, createAtom } from 'use-simple-atom'

export const counterAtom = createAtom('counter', {
  count: 0
});

export const Counter = () => {
  const [{ count }, setState] = useAtom(counterAtom);

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setState(({ count }) => { count: count + 1 })}>
        Increment
      </button>
      <button onClick={() => setState(({ count }) => { count: count - 1 })}>
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

## API
### `useAtom` hooks

```tsx
const [state, setState] = useAtom(atom, { selector });
```

`useAtom` is a hooks to get the state of an atom and the function to update it.

### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

- `selector` (type: `(state: T) => S | undefined`)
   - Function option that allows you to extract only the state you need from the atom.

### Returns
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

### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

- `useAtomStateOptions` (type: `UseAtomStateOptions<T>`)
  - same as `useAtomOptions`.

### Returns
- `state` (type: `T`)
  - State of the atom specified in the argument.

---

### `useAtomSetState` hooks

```tsx
const setState = useAtomState(atom);
```

`useAtomState` is a hooks to get the state of an atom.

### Arguments
- `atom` (type: `Atom<T>`)
  - Atom created by `createAtom` API.

### Returns
- `setState` (type: `(newState: ((state: T) => T) | T) => void`)
  - Function to update the state.

---

### `createAtom` function

```tsx
const atom = createAtom(key, value);
```

`createAtom` is a function to create atom.

### Arguments
- `key` (type: `string`)
  - The atom key must be unique.

- `value` (type: `T`)
  - Initial value of atom.

### Returns
- `atom` (type: `Atom<T>`)
  - Atom available for useAtom hooks, etc.

---

### `AtomStoreProvider` component

```tsx
 <AtomStoreProvider atomStore={atomStore}>
  { children here... }
 </AtomStoreProvider>
```

`AtomStoreProvider` is a component for managing atom.

** In order to use the useAtom hooks, you need to set the `AtomStoreProvider` on the parent or higher element. **

### Props
- `atomStore` (type: `AtomStore | undefined`)
  - props to set the store created by the `createAtomStore` function to Provider

---

### `createAtomStore` function

```tsx
const atomStore = createAtomStore({ initialValue: Record<string, unknown> })
```

`createAtomStore` is a function that creates a store. It is mainly used for SSR.

### Arguments
- `initialValue` (type: `Record<string, unknown> | undefined`)
  - Initial value of state. For example, it can be used to assign the result of SSR as the initial value.

### AtomStore
- `AtomStore.getState` (type:  `Record<string, unknown>`)
  - Function to get the state stored in the store.

---

### `useAtomStore` hooks

```tsx
const atomStore = useAtomStore()
```

`useAtomStore` is a hooks that get store in `AtomStoreProvider`.

## Examples
The following are some example of how to use `use-simple-atom`.

Note that the `AtomStoreProvider` must be specified as the parent or higher element.

### Basic

```tsx
import { useAtom, createAtom } from 'use-simple-atom'

export const counterAtom = createAtom('counter', {
  count: 0
});

export const Counter = () => {
  const [{ count }, setState] = useAtom(counterAtom);

  return (
    <div>
      <p>Counter: {count}</p>
        <button onClick={() => setState({ count: count + 1 })}>
          Increment
        </button>
        <button onClick={() => setState({ count: count - 1 })}>
          Decrement
        </button>
    </div>
  );
};
```

### Read only state of atom

```tsx
import { useAtomState, createAtom } from 'use-simple-atom'

export const counterAtom = createAtom('counter', {
  count: 0
});

export const userAtom = createAtom('user', {
  age: 22
});

export const Counter = () => {
  const { count } = useAtomState(counterAtom);
  const age = useAtomState(userAtom, { selector: ({ age }) => age });

  return (
    <div>
      <p>Counter: {count}</p>
      <p>Age: {age}</p>
    </div>
  );
};
```

### Get only setState of atom

```tsx
import { useAtomSetState, createAtom } from 'use-simple-atom'

export const counterAtom = createAtom('counter', {
  count: 0
});

export const Counter = () => {
  const setState = useAtomSetState(counterAtom);

  return (
    <div>
      <button onClick={() => setState(({ count }) => { count: count + 1 })}>
        Increment
      </button>
      <button onClick={() => setState(({ count }) => { count: count - 1 })}>
        Decrement
      </button>
    </div>
  );
};
```

## License
[MIT © kqito](./LICENSE)

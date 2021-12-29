import * as useIsomorphicLayoutEffectObject from '../utils/useIsomorphicLayoutEffect';
import { ReactElement, useLayoutEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';

export const useIsomorphicLayoutEffectMock = jest.spyOn(
  useIsomorphicLayoutEffectObject,
  'useIsomorphicLayoutEffect'
);

export type TestTarget = () => {
  root: ReactElement;
  expects: (container: HTMLElement) => void;
};

export const expectRenderResult = (target: TestTarget) => {
  it('CSR', () => {
    useIsomorphicLayoutEffectMock.mockImplementation((callback, deps) =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useLayoutEffect(callback, deps)
    );
    const { root, expects } = target();
    const { container } = render(root);

    expects(container);
  });

  it('SSR', () => {
    useIsomorphicLayoutEffectMock.mockImplementation((callback) => callback());

    const { root, expects } = target();
    const innerElement = renderToString(root);

    const container = document.createElement('div');
    container.innerHTML = innerElement;

    expects(container);
  });
};

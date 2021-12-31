import { createAtom } from '../dist';

export const countAtom = createAtom(10);

countAtom.subscribe((count) => {
  console.log('count is ', count);
});

import { useAtom, useAtomStore } from '../dist';
import { countAtom } from './Counter';
import { userAtom } from './User';

export const StoreInfo = () => {
  useAtom(countAtom);
  useAtom(userAtom);

  console.log('Store', useAtomStore());

  return null;
};
